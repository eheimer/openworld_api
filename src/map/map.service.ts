import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TileDataDto } from "./dto/tile-data.dto.js"
import { TileData } from "./entities/tileData.entity.js"

@Injectable()
export class MapService {
  constructor(@InjectRepository(TileData) private readonly repo: Repository<TileData>) {}

  async create(tileData: TileDataDto[]) {
    //overwrites the map with the new map
    await this.repo.clear()
    const tiles = this.repo.create(tileData)
    await this.repo.save(tiles)
    return { message: 'Map created with ' + tiles.length + ' tiles' }
  }

  findAll() {
    return this.repo.find()
  }
}

(globalThis as any).MapService = MapService
