import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/Schemas/User.schema';
import { LoginUserDto, RegisterUserDto } from './dto/User.dto';
import { Model } from 'mongoose';
import { Builder, By, Key, until } from 'selenium-webdriver';
import 'chromedriver';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(data: RegisterUserDto): Promise<User> {
    const profilePhoto = await this.fetchProfileImageUrl(data.linkedinUrl);

    if(!profilePhoto){
      return null
    }


    const userData={
      ...data,
      profilePhoto
    }
    // Include the profile image URL in the user data
    const user = await this.userModel.create(userData);

    console.log("### USER ###",user)
    console.log("### USER Data ###",userData)

    await user.save();
    return user;
  }

  async fetchProfileImageUrl(profileUrl: string): Promise<string> {
    let driver;

    try {
      // Create WebDriver instance
      driver = await new Builder().forBrowser('chrome').build();

      // Navigate to LinkedIn profile URL
      await driver.get(profileUrl);

      // Wait until the profile image element is located
      const profileImageElement = await driver.wait(
        until.elementLocated(By.id('ember38')),
        100000 // Timeout in milliseconds
      );

      // Wait until the profile image element is visible
      await driver.wait(
        until.elementIsVisible(profileImageElement),
        50000 // Timeout in milliseconds
      );

      // Get the profile image URL
      const profileImageUrl = await profileImageElement.getAttribute('src');
      console.log('Profile Image URL:', profileImageUrl);

      return profileImageUrl;
    } catch (error) {
      console.error('Error fetching profile image:', error);
      throw new HttpException('Error fetching profile image', 500);
    } finally {
      // Close the WebDriver instance in finally block
      if (driver) {
        try {
          await driver.quit();
        } catch (quitError) {
          console.error('Error quitting WebDriver:', quitError);
        }
      }
    }
  }

  async findOne(condition: any) {
    const user = await this.userModel
      .findOne(condition)
      .populate('tasks')
      .lean();
    console.log(condition);
    console.log(user);
    return user;
  }
}
