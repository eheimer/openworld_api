import { CallHandler, ExecutionContext, Logger, NestInterceptor, UseInterceptors } from '@nestjs/common'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { map, Observable } from 'rxjs'

/**
 * @description - This interceptor gives us the ability to choose between two different DTOs for the
 *              - response at runtime: one for public data and one for private details.  The public DTO
 *              - will generally be a subset (base class) of the private one.  We initialize this
 *              - interceptor with the public DTO and the private DTO.  The controller method can then
 *              - return a SerializeResponse object, which will specify which DTO to use.
 *              - If the controller initializes the interceptor with only a single DTO, or if it does not
 *              - return a SerializeResponse object, then the public DTO will be used.
 */
class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any, private dtoDetail: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result: SerializeResponse | object) => {
        const ctx = context.switchToHttp().getRequest()
        if (result instanceof SerializeResponse) {
          // if result.data is not an array, convert it to an array to simplify the logic below
          let singleResult = false
          if (!Array.isArray(result.data)) {
            singleResult = true
            result.data = [result.data]
          }
          const remapped = result.data.map((item) => {
            const value = getPossiblyNestedPropertyValue(item, result.propertyName)
            if (!value) {
              Logger.warn(
                `[${ctx.method} ${ctx.url}] - ${result.propertyName} not found in ${JSON.stringify(item, null, 2)}`
              )
            }
            if (value === result.value && !this.dtoDetail) {
              Logger.warn(`[${ctx.method} ${ctx.url}] - No detail DTO provided`)
            }
            const dto = result.propertyName && this.dtoDetail && value === result.value ? this.dtoDetail : this.dto
            return convertToDto(dto, item)
          })
          if (singleResult) {
            return remapped[0]
          }
          return remapped
        } else {
          //log a warning if dtoDetail is defined, but result is not a SerializeResponse object
          if (this.dtoDetail) {
            Logger.warn(
              `[${ctx.method} ${ctx.url}] : SerializeInterceptor: Detail DTO was requested, but result is not a SerializeResponse object`
            )
          }
        }
        return convertToDto(this.dto, result)
      })
    )
  }
}

function getPossiblyNestedPropertyValue(item: any, propertyName: string): any {
  const properties = propertyName.split('.')
  let value = item
  try {
    for (const property of properties) {
      value = value[property]
    }
  } catch (error) {
    return null
  }
  return value
}

/**
 * Resolve a DTO "type" into a runtime constructor and run
 * `plainToInstance` on the provided plain value. The dtoArg can be:
 * - a ClassConstructor (normal case)
 * - a zero-arg supplier function that returns the constructor (defers
 *   resolution until transform time and helps avoid TDZs)
 *
 * Note: we intentionally do not support string tokens here; those require
 * a runtime registry and reintroduce the global registration pattern.
 */
export function convertToDto(dtoArg: ClassConstructor<unknown> | (() => ClassConstructor<unknown>) | any, plain: unknown) {
  let ctor: ClassConstructor<unknown>

  if (dtoArg == null) {
    return plain
  }

  if (typeof dtoArg === 'function') {
    // Distinguish between a class constructor and a supplier function.
    const fnText = Function.prototype.toString.call(dtoArg)
    if (fnText.startsWith('class')) {
      ctor = dtoArg as ClassConstructor<unknown>
    } else {
      // supplier — call it now (at transform time)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctor = (dtoArg as () => any)()
    }
  } else {
    // fallback — assume it's already a constructor-like value
    ctor = dtoArg as ClassConstructor<unknown>
  }

  if (!ctor) {
    // if we couldn't resolve a constructor, return the plain value unchanged
    return plain
  }

  return plainToInstance(ctor, plain, { excludeExtraneousValues: true })
}

/**
 * @description - This is a class that can be returned by the controller method.  It contains the data to be
 *              - serialized and whether or not to use the private DTO.
 */
export class SerializeResponse {
  constructor(public data: any, public propertyName: string, public value) {}
}

/**
 * @description - This is the function that is used to initialize the interceptor.
 * @param dto - The public DTO to use if the requestor is not the same as the requested player.
 * @param detailDto - The detail DTO to use if the requestor is the same as the requested player.
 */
export function Serialize(dto: any, detailDto: any = undefined) {
  return UseInterceptors(new SerializeInterceptor(dto, detailDto))
}
