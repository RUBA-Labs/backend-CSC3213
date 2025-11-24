
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/role.enum';
import { TimetableManagementService } from './timetable-management.service';
import { CreateScheduleDto, DayOfWeek } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('TimetableManagement')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('timetable-management')
export class TimetableManagementController {
  constructor(
    private readonly timetableManagementService: TimetableManagementService,
  ) {}

  // Schedule endpoints
  @ApiTags('TimetableManagement')
  @Post('schedule')
  @Roles(Role.ADMIN, Role.TIME_TABLE_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Registers a new academic schedule entry with details like room, course, day, and time.' })
  @ApiResponse({ status: 201, description: 'The schedule has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.timetableManagementService.createSchedule(createScheduleDto);
  }

  @ApiTags('TimetableManagement')
  @Get('schedule')
  @ApiOperation({ summary: 'Retrieves a comprehensive list of all academic schedule entries.' })
  findAllSchedules() {
    return this.timetableManagementService.findAllSchedules();
  }

  @ApiTags('TimetableManagement')
  @Get('schedule/by-day-time')
  @ApiOperation({ summary: 'Fetches specific schedule entries filtered by day of the week and start time.' })
  findScheduleByDayAndTime(
    @Query('day') day: DayOfWeek,
    @Query('time') time: string,
  ) {
    return this.timetableManagementService.findScheduleByDayAndTime(day, time);
  }

  @ApiTags('TimetableManagement')
  @Get('schedule/:id')
  @ApiOperation({ summary: 'Retrieves a single academic schedule entry using its unique identifier.' })
  findOneSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.timetableManagementService.findOneSchedule(id);
  }

  @ApiTags('TimetableManagement')
  @Patch('schedule/:id')
  @Roles(Role.ADMIN, Role.TIME_TABLE_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Modifies an existing academic schedule entry with provided updated details.' })
  updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.timetableManagementService.updateSchedule(id, updateScheduleDto);
  }

  @ApiTags('TimetableManagement')
  @Delete('schedule/:id')
  @Roles(Role.ADMIN, Role.TIME_TABLE_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Removes an academic schedule entry from the system using its unique identifier.' })
  removeSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.timetableManagementService.removeSchedule(id);
  }

  // Room endpoints
  @ApiTags('TimetableManagement')
  @Post('room')
  @Roles(Role.ADMIN, Role.TIME_TABLE_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Registers a new physical room for timetable management.' })
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.timetableManagementService.createRoom(createRoomDto);
  }

  @ApiTags('TimetableManagement')
  @Get('room')
  @ApiOperation({ summary: 'Retrieves a list of all available rooms for scheduling.' })
  findAllRooms() {
    return this.timetableManagementService.findAllRooms();
  }

  @ApiTags('TimetableManagement')
  @Get('room/:id')
  @ApiOperation({ summary: 'Fetches a single room\'s details using its unique identifier.' })
  findOneRoom(@Param('id', ParseIntPipe) id: number) {
    return this.timetableManagementService.findOneRoom(id);
  }

  @ApiTags('TimetableManagement')
  @Patch('room/:id')
  @Roles(Role.ADMIN, Role.TIME_TABLE_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Modifies an existing room\'s details.' })
  updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.timetableManagementService.updateRoom(id, updateRoomDto);
  }

  @ApiTags('TimetableManagement')
  @Delete('room/:id')
  @Roles(Role.ADMIN, Role.TIME_TABLE_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Removes a room from the system using its unique identifier.' })
  removeRoom(@Param('id', ParseIntPipe) id: number) {
    return this.timetableManagementService.removeRoom(id);
  }
}
