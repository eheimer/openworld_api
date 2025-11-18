import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

registerEntity('LocalAuthGuard', LocalAuthGuard)
