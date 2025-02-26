function moneyBRL(price: string | number, decimals: number = 2) {
  // Se for número, assume que já está em reais
  if (typeof price === "number") {
    let formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);

    return formattedValue;
  }

  // Se for string (como em um input), mantém apenas os números
  let numericValue = price.replace(/[^\d]/g, "");

  // Se a string estiver vazia, assume 0 centavos
  if (!numericValue) numericValue = "0";

  // Converte para número e divide por 1000 para transformar centavos em reais
  let value = Number(numericValue) / 1000;

  let formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  
  return formattedValue;
}

function moneyArrayBRL(price: number) {
  let builder = moneyBRL(price);
  return builder.split(',', price);
}

function moneyToNumber(price: string | number): number {

  if (!price) {
    price = "0";
  }

  // Substituir ',' por '.' para tratar valores no formato brasileiro
  let initPrice = price.toString().replace(',', '.');

  // Remover caracteres não numéricos, exceto ponto decimal
  let formattedPrice = parseFloat(initPrice.replace(/[^\d.]/g, ''));

  // Arredondar para duas casas decimais
  return parseFloat(formattedPrice.toFixed(3));
}

function formatToBrazilianCurrency(value: number, decimalPlaces: number = 2): string {
  const formattedValue = value.toFixed(decimalPlaces).replace('.', ',');
  const [whole, fractional] = formattedValue.split(',');

  // Se a parte fracionária contém apenas zeros, retorna apenas a parte inteira
  if (fractional && parseInt(fractional) === 0) {
    return whole;
  }

  return formattedValue;
}

export { moneyBRL, moneyArrayBRL, moneyToNumber, formatToBrazilianCurrency };

function numberDecimal(value: string | number) {

  if (!value) {
    value = "0";
  }

  // Removendo caracteres que não são números nem ponto decimal
  let numericValue = value.toString().replace(/[^\d]/g, ""); // Mantém apenas números
  let formattedValue = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(Number(numericValue) / 1000);
  return `${formattedValue}`;
}

export { numberDecimal }  