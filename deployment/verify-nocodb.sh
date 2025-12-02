#!/bin/bash
# NocoDB Deployment Verification Script
# Checks all components of the NocoDB admin interface deployment

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Helper functions
print_header() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
}

print_test() {
    echo -n "Testing: $1... "
}

pass() {
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
}

fail() {
    echo -e "${RED}✗ FAIL${NC}"
    if [ -n "$1" ]; then
        echo -e "${RED}  Error: $1${NC}"
    fi
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠ WARNING${NC}"
    if [ -n "$1" ]; then
        echo -e "${YELLOW}  $1${NC}"
    fi
}

# Start verification
echo "🔍 NocoDB Deployment Verification"
echo "=================================="

# 1. Check Docker container status
print_header "1. Docker Container Status"

print_test "Docker daemon is running"
if systemctl is-active --quiet docker; then
    pass
else
    fail "Docker daemon is not running. Start with: systemctl start docker"
fi

print_test "NocoDB container exists"
if docker ps -a --format '{{.Names}}' | grep -q "openworld-nocodb"; then
    pass
else
    fail "NocoDB container not found. Deploy with: docker-compose -f deployment/docker-compose.nocodb.yml up -d"
fi

print_test "NocoDB container is running"
if docker ps --format '{{.Names}}' | grep -q "openworld-nocodb"; then
    pass
else
    fail "NocoDB container is not running. Start with: systemctl start nocodb"
fi

print_test "NocoDB container health"
if docker ps --filter "name=openworld-nocodb" --format '{{.Status}}' | grep -q "Up"; then
    pass
else
    fail "NocoDB container is unhealthy. Check logs with: docker logs openworld-nocodb"
fi

# 2. Check systemd service status
print_header "2. Systemd Service Status"

print_test "NocoDB systemd service exists"
if systemctl list-unit-files | grep -q "nocodb.service"; then
    pass
else
    fail "NocoDB systemd service not found. Install from deployment/nocodb.service"
fi

print_test "NocoDB systemd service is enabled"
if systemctl is-enabled --quiet nocodb 2>/dev/null; then
    pass
else
    warn "Service not enabled for auto-start. Enable with: systemctl enable nocodb"
fi

print_test "NocoDB systemd service is active"
if systemctl is-active --quiet nocodb; then
    pass
else
    fail "NocoDB service is not active. Start with: systemctl start nocodb"
fi

# 3. Test localhost:8080 connectivity
print_header "3. Local Connectivity"

print_test "Port 8080 is listening"
if netstat -tln 2>/dev/null | grep -q ":8080" || ss -tln 2>/dev/null | grep -q ":8080"; then
    pass
else
    fail "Port 8080 is not listening. Check if NocoDB is running."
fi

print_test "NocoDB responds on localhost:8080"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200\|302"; then
    pass
else
    fail "NocoDB not responding on localhost:8080. Check container logs."
fi

print_test "NocoDB health endpoint"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/health 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    pass
elif [ "$HTTP_CODE" = "404" ]; then
    warn "Health endpoint not available (this may be normal for some NocoDB versions)"
else
    fail "Health endpoint returned HTTP $HTTP_CODE"
fi

# 4. Test HTTPS access to /admin endpoint
print_header "4. HTTPS Access"

print_test "Apache is running"
if systemctl is-active --quiet apache2; then
    pass
else
    fail "Apache is not running. Start with: systemctl start apache2"
fi

print_test "Apache proxy modules enabled"
if apache2ctl -M 2>/dev/null | grep -q "proxy_module\|proxy_http_module"; then
    pass
else
    fail "Apache proxy modules not enabled. Enable with: a2enmod proxy proxy_http"
fi

print_test "HTTPS /admin endpoint responds"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -k https://localhost/admin 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    pass
elif [ "$HTTP_CODE" = "502" ]; then
    fail "502 Bad Gateway - NocoDB may not be running or proxy misconfigured"
elif [ "$HTTP_CODE" = "000" ]; then
    fail "Cannot connect to Apache. Check if Apache is running and SSL is configured."
else
    fail "Unexpected HTTP code: $HTTP_CODE"
fi

print_test "External HTTPS access (if hostname resolves)"
if command -v dig &> /dev/null; then
    HOSTNAME="openworld.heimerman.org"
    if dig +short $HOSTNAME | grep -q .; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$HOSTNAME/admin 2>/dev/null || echo "000")
        if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
            pass
        else
            warn "External access returned HTTP $HTTP_CODE (may be normal if testing locally)"
        fi
    else
        warn "Hostname does not resolve (skipping external test)"
    fi
else
    warn "dig command not available (skipping DNS check)"
fi

# 5. Verify database connection
print_header "5. Database Connection"

print_test "MySQL is running"
if systemctl is-active --quiet mysql; then
    pass
else
    fail "MySQL is not running. Start with: systemctl start mysql"
fi

print_test "MySQL port 3306 is listening"
if netstat -tln 2>/dev/null | grep -q ":3306" || ss -tln 2>/dev/null | grep -q ":3306"; then
    pass
else
    fail "MySQL port 3306 is not listening"
fi

print_test "NocoDB can reach MySQL"
# Check if NocoDB container can connect to host MySQL
if docker exec openworld-nocodb nc -z host.docker.internal 3306 2>/dev/null || \
   docker exec openworld-nocodb nc -z 172.17.0.1 3306 2>/dev/null; then
    pass
else
    warn "Cannot verify MySQL connectivity from container (this may be normal)"
fi

print_test "Database 'openworld' exists"
if mysql -u openworld -p"${DB_PASSWORD:-}" -e "USE openworld;" 2>/dev/null; then
    pass
else
    warn "Cannot verify database (credentials may not be available in environment)"
fi

# Summary
print_header "Verification Summary"

TOTAL=$((PASSED + FAILED))
echo "Tests Passed: ${GREEN}$PASSED${NC}"
echo "Tests Failed: ${RED}$FAILED${NC}"
echo "Total Tests:  $TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Access NocoDB at: https://openworld.heimerman.org/admin"
    echo "  2. Login with admin credentials (owadmin)"
    echo "  3. Configure database connection in NocoDB UI"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the errors above.${NC}"
    echo ""
    echo "Common troubleshooting commands:"
    echo "  - Check NocoDB logs: docker logs openworld-nocodb"
    echo "  - Check systemd status: systemctl status nocodb"
    echo "  - Check Apache logs: tail -f /var/log/apache2/error.log"
    echo "  - Restart NocoDB: systemctl restart nocodb"
    exit 1
fi
