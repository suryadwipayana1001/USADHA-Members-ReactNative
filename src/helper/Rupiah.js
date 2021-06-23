export function Rupiah(angka) {
  var rupiah = '';
  var angkarev = angka.toString().split('').reverse().join('');
  for (var i = 0; i < angkarev.length; i++) {
    if (i % 3 == 0) {
      rupiah += angkarev.substr(i, 3) + '.';
    }
  }
  return (
    'Rp. ' +
    rupiah
      .split('', rupiah.length - 1)
      .reverse()
      .join('')
  );
}

// export function convertToAngka(rupiah)
// {
// 	return parseInt(rupiah.replace(/,.*|[^0-9]/g, ''), 10);
// }
