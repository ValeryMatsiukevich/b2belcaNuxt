import { defineEventHandler } from 'h3'
import fs from 'fs/promises'
import slugify from 'slugify'
export interface Goods {
  NomCode: string;
  NomNaim: string;
  RoditelCode: string;
  slug: string;
  IsGropup: string;
  Quantity: number;
  Akcionniy: string;
  Vigr7712: string;
  ZapretProdazhiNARD: string;
  Price: string;
  inCart: number;
}
export default defineEventHandler(async (event) => {
  console.log("FOLDERS API CALLED");

  
  let data = await fs.readFile('./public/nom1c8b2b.json', 'utf-8');
  let folders = JSON.parse(data)
  folders = folders.filter((el: { IsGropup: string }) => el.IsGropup === 'Да')
  // folders = folders.filter((el: Goods) => el.NomCode !== '99990001' && el.NomCode !== 'D2616486');
  folders.forEach((element:Goods) => {
    element.slug = slugify(element.NomNaim + element.NomCode)
    //console.log(element.NomNaim + ' --- '+ element.NomCode)
  })
  // console.log(folders.length)

  folders.sort((a:Goods, b:Goods) => a.NomNaim.localeCompare(b.NomNaim));
  return folders;
});