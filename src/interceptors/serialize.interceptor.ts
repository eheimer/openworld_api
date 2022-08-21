import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common'
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
        return convertToDto(
          shouldReturnDetail(result) && this.dtoDetail !== undefined ? this.dtoDetail : this.dto,
          determineData(result)
        )
      })
    )
  }
}

export function convertToDto(dto: ClassConstructor<unknown>, plain: unknown) {
  return plainToInstance(dto, plain, { excludeExtraneousValues: true })
}

function isSerializeResponse(response: any): boolean {
  return (
    typeof response === 'object' && response !== null && response.detail !== undefined && response.data !== undefined
  )
}

/**
 * @description - This is a class that can be returned by the controller method.  It contains the data to be
 *              - serialized and whether or not to use the private DTO.
 */
export class SerializeResponse {
  constructor(public detail: boolean, public data: any) {}
}

/**
 * @description - This is the function that is used to initialize the interceptor.
 * @param dto - The public DTO to use if the requestor is not the same as the requested player.
 * @param detailDto - The detail DTO to use if the requestor is the same as the requested player.
 */
export function Serialize(dto: object, detailDto: object = undefined) {
  return UseInterceptors(new SerializeInterceptor(dto, detailDto))
}

function shouldReturnDetail(result: any): boolean {
  return isSerializeResponse(result) && result.detail
}

function determineData(result: any): any {
  return isSerializeResponse(result) ? result.data : result
}
