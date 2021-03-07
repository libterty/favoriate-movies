import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import * as IMovie from '../movies/interfaces';

@Injectable()
export class UploaderService {
  /**
   * @description Check if Directory is exited or not
   * @private
   * @returns {Promise<boolean}
   */
  private isDirectoryExist(): Promise<boolean> {
    const path: string = join(process.cwd(), 'public/assets');
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      return fs.stat(path, (err, stats) => {
        if (!stats) {
          fs.mkdirSync(join(process.cwd(), 'public'));
          fs.mkdirSync(join(process.cwd(), 'public/assets'));
          // create a empty html file to avoid nestjs server static throw error
          fs.writeFileSync(join(process.cwd(), 'public/assets/index.html'), '', 'utf8');
          return resolve(true);
        }
        return resolve(true);
      });
    });
  }

  /**
   * @description Create Write Stream
   * @private
   * @param {IMovie.BufferedFile} file
   * @returns {Promise<string>}
   */
  public async writeStream(createMovieFileDto: IMovie.BufferedFile): Promise<string> {
    const isDir = await this.isDirectoryExist();
    if (!isDir) throw new InternalServerErrorException('Directory not existed');

    return new Promise((resolve, reject) => {
      return fs.createWriteStream(join(process.cwd(), `public/assets/${createMovieFileDto.originalname}`)).write(Buffer.from(createMovieFileDto.buffer), (err) => {
        if (err) return reject(err.message);
        return resolve(`${createMovieFileDto.originalname}`);
      });
    });
  }
}
