import { ClassConstructor, Transform } from 'class-transformer'
import { convertToDto } from "../interceptors/serialize.interceptor"

// Allows us to mark a property as a DTO type.
//
// The decorator accepts either:
// - nothing: the decorator will try to read the runtime constructor from
//   `Reflect.getMetadata('design:type', target, propertyKey)` (works for
//   non-array class-typed properties when `emitDecoratorMetadata` is enabled),
// - a ClassConstructor directly (e.g. `@DTO(PlayerDto)`), or
// - a zero-arg supplier function that returns the constructor (defers
//   runtime lookups, useful to avoid module-init TDZs)
//
// Note: TypeScript's `design:type` metadata cannot express array element
// types (an `X[]` property has `design:type === Array`). For array
// properties you must either pass the constructor directly or use a
// supplier (the supplier is recommended when cycles exist).
export function DTO(dto?: ClassConstructor<unknown> | (() => ClassConstructor<unknown>)): PropertyDecorator {
  return function (target: any, propertyKey: string) {
    return Transform(({ obj }) => {
      // Handle null/undefined values
      const value = obj[propertyKey]
      if (value == null) {
        return value
      }

      let ctor: ClassConstructor<unknown>

      if (dto == null) {
        // Try to read design:type metadata (requires `emitDecoratorMetadata`
        // and that `reflect-metadata` be imported at app bootstrap).
        if (typeof Reflect === 'undefined' || typeof Reflect.getMetadata !== 'function') {
          throw new Error("@DTO(): Reflect.getMetadata is not available. Make sure 'reflect-metadata' is imported and 'emitDecoratorMetadata' is enabled in tsconfig")
        }

        const designType = Reflect.getMetadata('design:type', target, propertyKey)
        if (!designType) {
          throw new Error(`@DTO(): no design:type metadata found for property ${String(propertyKey)}. Ensure emitDecoratorMetadata is enabled and reflect-metadata is imported`)
        }

        if (designType === Array) {
          throw new Error(`@DTO(): cannot infer array element type for property ${String(propertyKey)}; pass the element constructor (e.g. @DTO(CharacterDto)) or a supplier to defer resolution`) 
        }

        ctor = designType as ClassConstructor<unknown>
      } else if (typeof dto === 'function') {
        // Distinguish between a class constructor (ES6 `class`) and a
        // supplier function. Class constructors stringify starting with
        // `class `; supplier functions / arrow functions do not.
        const fnText = Function.prototype.toString.call(dto)
        if (fnText.startsWith('class')) {
          ctor = dto as ClassConstructor<unknown>
        } else {
          // supplier function — call it now (at transform time)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctor = (dto as () => any)()
        }
      } else {
        // fallback — treat as class constructor
        ctor = dto as ClassConstructor<unknown>
      }

      return convertToDto(ctor as ClassConstructor<unknown>, value)
    })(target, propertyKey)
  }
}
