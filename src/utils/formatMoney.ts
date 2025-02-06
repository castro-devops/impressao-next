function moneyBRL(price: string | number) {
     // Removendo caracteres que não são números nem ponto decimal
     let numericValue = price.toString().replace(/\D+/g, ""); // Mantém apenas números
     let formattedValue = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
     }).format(Number(numericValue) / 100); // Dividindo por 100 para corrigir casas decimais
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