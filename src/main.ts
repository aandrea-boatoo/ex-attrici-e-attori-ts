type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number
  death_year?: number
  biography: string;
  image: string
}

type nationality = "American" | "British" | "Australian" | "Israeli-American" | "South African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese";
type Actress = Person & {
  most_famous_movie: [string, string, string];
  awards: string;
  nationality: nationality;
}

function isActress(dati: unknown): dati is Actress {
  return (
    typeof dati === 'object' && dati !== null &&
    "id" in dati && typeof dati.id === 'number' &&
    "name" in dati && typeof dati.name === 'string' &&
    "birth_year" in dati && typeof dati.birth_year === 'number' &&
    "death_year" in dati && typeof dati.death_year === 'number' &&
    "biography" in dati && typeof dati.biography === 'string' &&
    "image" in dati && typeof dati.image === 'string' &&
    "most_famous_movie" in dati &&
    dati.most_famous_movie instanceof Array && dati.most_famous_movie.length === 3 && dati.most_famous_movie.every(m => typeof m === 'string') &&
    "awards" in dati && typeof dati.awards === 'string' &&
    "nationality" in dati && typeof dati.nationality === 'string'
  )
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actress/${id}`);
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error('Formato dei dati non valido');
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dell \' attrice', error);
    } else {
      console.log('errore sconosciuto', error)
    }
    return null
  }

}

async function getAllActress(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actress`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`)
    }
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error('Formato dei dati non valido');
    }
    const attriciValide: Actress[] = dati.filter(a => isActress(a));

    return attriciValide;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero delle attrici', error);
    } else {
      console.log('errore sconosciuto', error)
    }
    return []
  }
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map(id => getActress(id))
    return await Promise.all(promises)
  } catch (errore) {
    if (errore instanceof Error) {
      console.error('Errore durante il recupero delle attrici', errore);
    } else {
      console.log('errore sconosciuto', errore)
    }
    return []
  }

  ;
}