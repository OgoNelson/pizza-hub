import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<AdminDocument | null> {
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) return null;

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return null;

    return admin;
  }

  async login(admin: AdminDocument) {
    const payload = {
      email: admin.email,
      sub: admin._id.toString(),
    };

    const accessToken = this.jwtService.sign(payload);

    await this.adminModel.findByIdAndUpdate(admin._id, {
      lastLogin: new Date(),
    });

    return {
      access_token: accessToken,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async createAdmin(createAdminDto: any): Promise<AdminDocument> {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = new this.adminModel({
      ...createAdminDto,
      password: hashedPassword,
    });

    return admin.save();
  }
}
