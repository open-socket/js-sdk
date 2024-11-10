import { NoOpProvider } from './no-op-provider';
import type { ProviderInterface } from './provider';

export class SingletonProvider {
  private static instance: ProviderInterface;

  static setProvider(provider: ProviderInterface) {
    this.instance = provider;
  }

  static getProvider(): ProviderInterface {
    if (!this.instance) {
      return new NoOpProvider();
    }
    return this.instance;
  }
}
