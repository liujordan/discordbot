import {BaseCommand} from './baseCommand';
import {injectable} from "tsyringe";

@injectable()
export class Test extends BaseCommand {
  name = 'test';
  help = 'test'
}
