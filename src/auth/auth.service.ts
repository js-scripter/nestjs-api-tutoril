import { ForbiddenException, Injectable } from "@nestjs/common";
import {User, Bookmark} from '@prisma/client'
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService
    ){

    }
    login(){}

    async signup(dto: AuthDto){
        // generate password hash
        const hash = await argon.hash(dto.password);

        //save new user in db
        try{
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash,
                },
                // select:{
                //     id:true,
                //     email:true,
                //     createdAt:true,
                // }
            })
            delete user.hash;
            //return saved user
            return user;
        }catch(error){
            console.log(error)
            if(error.code==='P2002'){
                throw new ForbiddenException('user already exists');
            }
            throw error;
        };
    }

    signin(){
        return {msg:'I am signed IN'}
    }
}