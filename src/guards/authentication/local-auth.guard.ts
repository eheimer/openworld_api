import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { getEntity, registerEntity } from "../../entityRegistry"

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

registerEntity('LocalAuthGuard', LocalAuthGuard)
