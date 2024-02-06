import { WalletType } from '@particle-network/rn-connect';

export class PNAccount {
  static walletType = WalletType.Particle;

  icons;
  name;
  publicAddress;
  url;

  constructor(
    icons,
    name,
    publicAddress,
    url
  ) {
    this.icons = icons;
    this.name = name;
    this.publicAddress = publicAddress;
    this.url = url;
  }

  static parseFrom(params) {
  return JSON.parse(params);
  }
}