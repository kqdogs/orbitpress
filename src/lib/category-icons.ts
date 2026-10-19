import elementNames from './element-icon-names.json';
export const legacyCategoryIcons={card:'CreditCard',bank:'OfficeBuilding',chart:'TrendCharts',sparkles:'MagicStick',phone:'Iphone',sim:'Postcard',apple:'Apple',globe:'Position'} as const;
export const categoryIconValues=[...Object.keys(legacyCategoryIcons),...elementNames.map(name=>`ep:${name}`)] as [string,...string[]];
const elementSet=new Set(elementNames);
export function elementCategoryIcon(name:string){
 if(Object.hasOwn(legacyCategoryIcons,name))return legacyCategoryIcons[name as keyof typeof legacyCategoryIcons];
 return name.startsWith('ep:')&&elementSet.has(name.slice(3))?name.slice(3):null;
}
export const categoryIconGroups=[{title:'原有图标',icons:Object.keys(legacyCategoryIcons)},{title:'Element Plus 图标库',icons:elementNames.map(name=>`ep:${name}`)}];
