import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { Tag } from 'src/Schema/tag.schema';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
    constructor(private readonly educationService: EducationService){}
    /**
     * gets all education resources from db
     * @returns all education resources from db
     */
    @Get()
    async getAllEducationResources(){
        const educationResources = await this.educationService.getAllEducationResources()
        return educationResources
    }

    /**
     * gets education resource with given id from db
     * @param educationId - id of education resource to be retrieved 
     * @returns education resource with given id from db
     */
    @Get("/:educationId")
    async getEducationResourceById(@Param("educationId") educationId:string){
        const resource = this.educationService.getEducationResourceById(educationId)
        return resource
    }


    /**
     * creates / modifies education resource in db with given info
     * @param name - name of resource
     * @param description - resource's description
     * @param website - resource's website
     * @param email - resource's email
     * @param phoneNumber - resource's phone number
     * @param tags - tags used to describe resource
     * @returns id of modified or new resource
     */
    @Put()
    async createEducationResource(@Body("name") name:string,
    @Body("description") description:string,
    @Body('website') website:string,
    @Body('email') email:string,
    @Body('phoneNumber') phoneNumber:string,
    @Body('tags') tags:Tag[]){
        const newId = await this.educationService.createEducationResource(name,description,website,email,phoneNumber,tags)
        return newId
    }
    /**
     * deletes resource within db given by id
     * @param educationId -id of resource
     * @returns null
     */
    @Delete("/:educationId")
    async deleteResourceById(@Param('educationId') educationId:string){
        await this.educationService.deleteEducationResource(educationId)
        return
    }
}