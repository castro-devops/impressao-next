function moneyBRL(price: string | number) {
  let numericValue = price.toString().replace(/[^\d]/g, ""); // Mantém apenas números
  let formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(numericValue) / 100);
  return formattedValue;
}

function moneyArrayBRL(price: number) {
  let builder = moneyBRL(price);
  return builder.split(',', price);
}

function moneyToNumber(price: string | number): number {
  // Substituir ',' por '.' para tratar valores no formato brasileiro
  let initPrice = price.toString().replace(',', '.');
  let formattedPrice = Number(initPrice.replace(/\D.\D+/g, ""));

  return formattedPrice;
}

export { moneyBRL, moneyArrayBRL, moneyToNumber };

function numberDecimal(value: string | number) {
  // Removendo caracteres que não são números nem ponto decimal
  let numericValue = value.toString().replace(/[^\d]/g, ""); // Mantém apenas números
  let formattedValue = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(numericValue) / 100); // Ajuste para casas decimais
  return `${formattedValue}`; // Adicionando unidade manualmente
}

export { numberDecimal }