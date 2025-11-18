import { CanActivate, Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { CharactersService } from "../../games/characters/characters.service.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

/**
 * @description - This guard verifies that the current player is the owner of the requested character and inventory
 */
@Injectable()
export class InventoryOwnerGuard implements CanActivate {
  constructor(private charactersService: CharactersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.params.inventoryId) throw new BadRequestException('Inventory id is required')
    const character = await this.charactersService.findOneByPlayerAndInventory(
      request.user.id,
      request.params.inventoryId
    )
    return !!character
  }
}

registerEntity('InventoryOwnerGuard', InventoryOwnerGuard)
