import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ description: 'Whether the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T | null;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'ISO timestamp of response' })
  timestamp: string;

  constructor(success: boolean, data: T | null, message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  static ok<T>(data: T, message = 'OK'): ApiResponse<T> {
    return new ApiResponse<T>(true, data, message);
  }

  static fail(message: string): ApiResponse<null> {
    return new ApiResponse<null>(false, null, message);
  }
}