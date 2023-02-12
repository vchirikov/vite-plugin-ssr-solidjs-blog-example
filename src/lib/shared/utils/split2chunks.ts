export function split2chunks<Type>(array: Type[], chunk_size: number) {
  return Array.from({ length: Math.ceil(array.length / chunk_size) })
    .fill(0)
    .map((_, index) => {
      const begin = index * chunk_size;
      return array.slice(begin, begin + chunk_size);
    });
}