import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from 'entities/log.entity';
import { ActionsService } from '../actions/actions.service';
import { ComponentsService } from '../components/components.service';
import { Action } from 'entities/action.entity';
import { Component } from 'entities/component.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Log]), 
    TypeOrmModule.forFeature([Action]), 
    TypeOrmModule.forFeature([Component]),
  ],
  controllers: [LogsController],
  providers: [
    LogsService, 
    ActionsService, 
    ComponentsService,
    JwtService
  ]
})
export class LogsModule {}
