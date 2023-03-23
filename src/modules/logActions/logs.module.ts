import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from 'src/entities/log.entity';
import { ActionsService } from '../actions/actions.service';
import { ComponentsService } from '../components/components.service';
import { Action } from 'src/entities/action.entity';
import { Component } from 'src/entities/component.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Log]), 
    TypeOrmModule.forFeature([Action]), 
    TypeOrmModule.forFeature([Component])
  ],
  controllers: [LogsController],
  providers: [
    LogsService, 
    ActionsService, 
    ComponentsService
  ]
})
export class LogsModule {}
