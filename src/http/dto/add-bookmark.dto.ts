import { IsInt, IsNotEmpty, Max, Min } from 'class-validator'

export class AddBookmarkDto {
  @IsInt()
  public readonly sourceId!: number
  @IsNotEmpty()
  public readonly name!: string
  @IsNotEmpty()
  public readonly group!: string
  @IsInt()
  @Min(1)
  @Max(10000)
  public readonly numPosts!: number
}
