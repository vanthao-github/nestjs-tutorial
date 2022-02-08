import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
    @Get('/')
    info(): string {
        return 'oh my god';
    }
}