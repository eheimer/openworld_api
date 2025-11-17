import { ClassConstructor, Transform } from 'class-transformer'
import { convertToDto } from "../interceptors/serialize.interceptor.js"

// Allows us to mark a property as a DTO type, thereby allowing the
// class-transformer to convert it to the DTO type.
export function DTO(dto: ClassConstructor<unknown>): PropertyDecorator {
  return function (target: any, propertyKey: string) {
    return Transform(({ obj }) => {
      return convertToDto(dto, obj[propertyKey])
    })(target, propertyKey)
  }
}
