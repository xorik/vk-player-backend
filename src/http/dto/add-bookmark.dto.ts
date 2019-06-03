import { IsInt, IsNotEmpty } from 'class-validator'

export class AddBookmarkDto {
  @IsInt()
  public readonly sourceId!: number
  @IsNotEmpty()
  public readonly name!: string
  @IsNotEmpty()
  public readonly group!: string
}
