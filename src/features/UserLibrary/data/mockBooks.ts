export interface IndustryIdentifier {
  type: 'ISBN_10' | 'ISBN_13'
  identifier: string
}

export interface ImageLinks {
  smallThumbnail: string
  thumbnail: string
  small?: string
  medium?: string
  large?: string
  extraLarge?: string
}

export interface Price {
  amount: number
  currencyCode: string
}

export interface Epub {
  isAvailable: boolean
  acsTokenLink?: string
}

export interface Pdf {
  isAvailable: boolean
  acsTokenLink?: string
}

export interface VolumeInfo {
  title: string
  subtitle?: string
  authors: string[]
  publisher: string
  publishedDate: string
  description: string
  industryIdentifiers: IndustryIdentifier[]
  pageCount: number
  printType: 'BOOK' | 'MAGAZINE'
  mainCategory: string
  categories: string[]
  averageRating: number
  ratingsCount: number
  imageLinks: ImageLinks
  language: string
  infoLink: string
  canonicalVolumeLink: string
}

export interface SaleInfo {
  country: string
  saleability: 'FOR_SALE' | 'FREE' | 'NOT_FOR_SALE'
  isEbook: boolean
  listPrice: Price
  retailPrice: Price
  buyLink?: string
}

export interface AccessInfo {
  country: string
  viewability: 'ALL_PAGES' | 'PARTIAL' | 'NO_PAGES'
  embeddable: boolean
  publicDomain: boolean
  epub: Epub
  pdf: Pdf
  accessViewStatus: 'FULL_PUBLIC_DOMAIN' | 'SAMPLE' | 'NONE'
}

export interface Volume {
  kind: 'books#volume'
  id: string
  etag: string
  selfLink: string
  volumeInfo: VolumeInfo
  saleInfo: SaleInfo
  accessInfo: AccessInfo
}

export interface VolumesResponse {
  kind: 'books#volumes'
  totalItems: number
  items: Volume[]
}

export const mockVolumesResponse: VolumesResponse = {
  kind: 'books#volumes',
  totalItems: 8,
  items: [
    {
      kind: 'books#volume',
      id: 'aAbBcC123456',
      etag: 'x1Y2z3W4v5U',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/aAbBcC123456',
      volumeInfo: {
        title: 'Clean Code',
        subtitle: 'A Handbook of Agile Software Craftsmanship',
        authors: ['Robert C. Martin'],
        publisher: 'Prentice Hall',
        publishedDate: '2008-08-01',
        description:
          "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code.",
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0132350882' },
          { type: 'ISBN_13', identifier: '9780132350884' },
        ],
        pageCount: 464,
        printType: 'BOOK',
        mainCategory: 'Computers / Software Engineering',
        categories: ['Software Engineering', 'Agile', 'Programming'],
        averageRating: 4.5,
        ratingsCount: 3200,
        imageLinks: {
          smallThumbnail:
            'https://covers.openlibrary.org/b/isbn/9780132350884-S.jpg',
          thumbnail:
            'https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg',
        },
        language: 'en',
        infoLink: 'https://books.google.com/books?id=aAbBcC123456',
        canonicalVolumeLink:
          'https://books.google.com/books/about/Clean_Code.html?id=aAbBcC123456',
      },
      saleInfo: {
        country: 'FR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: { amount: 34.99, currencyCode: 'EUR' },
        retailPrice: { amount: 29.99, currencyCode: 'EUR' },
        buyLink: 'https://books.google.com/books?id=aAbBcC123456&buy=',
      },
      accessInfo: {
        country: 'FR',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        epub: { isAvailable: true },
        pdf: { isAvailable: false },
        accessViewStatus: 'SAMPLE',
      },
    },
    {
      kind: 'books#volume',
      id: 'dDeEfF789012',
      etag: 'aB1cD2eF3gH',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/dDeEfF789012',
      volumeInfo: {
        title: 'Dune',
        subtitle: 'The Gateway to Spice',
        authors: ['Frank Herbert'],
        publisher: 'Ace Books',
        publishedDate: '1990-09-01',
        description:
          'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the spice melange.',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0441013597' },
          { type: 'ISBN_13', identifier: '9780441013593' },
        ],
        pageCount: 896,
        printType: 'BOOK',
        mainCategory: 'Fiction / Science Fiction',
        categories: ['Science Fiction', 'Epic', 'Classic'],
        averageRating: 4.7,
        ratingsCount: 87000,
        imageLinks: {
          smallThumbnail:
            'https://covers.openlibrary.org/b/isbn/9780441013593-S.jpg',
          thumbnail:
            'https://covers.openlibrary.org/b/isbn/9780441013593-M.jpg',
        },
        language: 'en',
        infoLink: 'https://books.google.com/books?id=dDeEfF789012',
        canonicalVolumeLink:
          'https://books.google.com/books/about/Dune.html?id=dDeEfF789012',
      },
      saleInfo: {
        country: 'FR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: { amount: 12.99, currencyCode: 'EUR' },
        retailPrice: { amount: 9.99, currencyCode: 'EUR' },
        buyLink: 'https://books.google.com/books?id=dDeEfF789012&buy=',
      },
      accessInfo: {
        country: 'FR',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        epub: { isAvailable: true },
        pdf: { isAvailable: true },
        accessViewStatus: 'SAMPLE',
      },
    },
    {
      kind: 'books#volume',
      id: 'gGhHiI345678',
      etag: 'iJ4kL5mN6oP',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/gGhHiI345678',
      volumeInfo: {
        title: 'Sapiens',
        subtitle: 'A Brief History of Humankind',
        authors: ['Yuval Noah Harari'],
        publisher: 'Harper',
        publishedDate: '2015-02-10',
        description:
          "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us.",
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0062316117' },
          { type: 'ISBN_13', identifier: '9780062316110' },
        ],
        pageCount: 443,
        printType: 'BOOK',
        mainCategory: 'History / World',
        categories: ['History', 'Anthropology', 'Science'],
        averageRating: 4.4,
        ratingsCount: 54000,
        imageLinks: {
          smallThumbnail:
            'https://covers.openlibrary.org/b/isbn/9780062316110-S.jpg',
          thumbnail:
            'https://covers.openlibrary.org/b/isbn/9780062316110-M.jpg',
        },
        language: 'en',
        infoLink: 'https://books.google.com/books?id=gGhHiI345678',
        canonicalVolumeLink:
          'https://books.google.com/books/about/Sapiens.html?id=gGhHiI345678',
      },
      saleInfo: {
        country: 'FR',
        saleability: 'FOR_SALE',
        isEbook: false,
        listPrice: { amount: 18.5, currencyCode: 'EUR' },
        retailPrice: { amount: 18.5, currencyCode: 'EUR' },
      },
      accessInfo: {
        country: 'FR',
        viewability: 'NO_PAGES',
        embeddable: false,
        publicDomain: false,
        epub: { isAvailable: false },
        pdf: { isAvailable: false },
        accessViewStatus: 'NONE',
      },
    },
    {
      kind: 'books#volume',
      id: 'jJkKlL901234',
      etag: 'qR7sT8uV9wX',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/jJkKlL901234',
      volumeInfo: {
        title: 'The Design of Everyday Things',
        subtitle: 'Revised and Expanded Edition',
        authors: ['Don Norman'],
        publisher: 'Basic Books',
        publishedDate: '2013-11-05',
        description:
          'Even the smartest among us can feel inept as we fail to figure out which light switch or oven burner to turn on, or whether to push, pull, or slide a door. The fault lies with the designers who are focused on appearance instead of usability.',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0465050654' },
          { type: 'ISBN_13', identifier: '9780465050659' },
        ],
        pageCount: 368,
        printType: 'BOOK',
        mainCategory: 'Design / Product',
        categories: ['Design', 'UX', 'Psychology'],
        averageRating: 4.3,
        ratingsCount: 19500,
        imageLinks: {
          smallThumbnail:
            'https://covers.openlibrary.org/b/isbn/9780465050659-S.jpg',
          thumbnail:
            'https://covers.openlibrary.org/b/isbn/9780465050659-M.jpg',
        },
        language: 'en',
        infoLink: 'https://books.google.com/books?id=jJkKlL901234',
        canonicalVolumeLink:
          'https://books.google.com/books/about/The_Design_of_Everyday_Things.html?id=jJkKlL901234',
      },
      saleInfo: {
        country: 'FR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: { amount: 21.99, currencyCode: 'EUR' },
        retailPrice: { amount: 17.99, currencyCode: 'EUR' },
        buyLink: 'https://books.google.com/books?id=jJkKlL901234&buy=',
      },
      accessInfo: {
        country: 'FR',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        epub: { isAvailable: true },
        pdf: { isAvailable: false },
        accessViewStatus: 'SAMPLE',
      },
    },
    {
      kind: 'books#volume',
      id: 'mMnNoO567890',
      etag: 'yZ0aB1cD2eF',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/mMnNoO567890',
      volumeInfo: {
        title: 'Atomic Habits',
        subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
        authors: ['James Clear'],
        publisher: 'Avery',
        publishedDate: '2018-10-16',
        description:
          'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0735211299' },
          { type: 'ISBN_13', identifier: '9780735211292' },
        ],
        pageCount: 320,
        printType: 'BOOK',
        mainCategory: 'Self-Help / Personal Growth',
        categories: ['Self-Help', 'Psychology', 'Productivity'],
        averageRating: 4.8,
        ratingsCount: 112000,
        imageLinks: {
          smallThumbnail:
            'https://covers.openlibrary.org/b/isbn/9780735211292-S.jpg',
          thumbnail:
            'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg',
        },
        language: 'en',
        infoLink: 'https://books.google.com/books?id=mMnNoO567890',
        canonicalVolumeLink:
          'https://books.google.com/books/about/Atomic_Habits.html?id=mMnNoO567890',
      },
      saleInfo: {
        country: 'FR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: { amount: 14.99, currencyCode: 'EUR' },
        retailPrice: { amount: 12.99, currencyCode: 'EUR' },
        buyLink: 'https://books.google.com/books?id=mMnNoO567890&buy=',
      },
      accessInfo: {
        country: 'FR',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        epub: { isAvailable: true },
        pdf: { isAvailable: true },
        accessViewStatus: 'SAMPLE',
      },
    },
    {
      kind: 'books#volume',
      id: 'pPqQrR123789',
      etag: 'gH3iJ4kL5mN',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/pPqQrR123789',
      volumeInfo: {
        title: '1984',
        authors: ['George Orwell'],
        publisher: 'Signet Classic',
        publishedDate: '1961-01-01',
        description:
          "Written in 1948, 1984 was George Orwell's chilling prophecy about the future. A dystopian masterpiece about a society under total surveillance, where history is rewritten to fit the needs of a totalitarian regime.",
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0451524934' },
          { type: 'ISBN_13', identifier: '9780451524935' },
        ],
        pageCount: 328,
        printType: 'BOOK',
        mainCategory: 'Fiction / Dystopian',
        categories: ['Classic', 'Dystopia', 'Political Fiction'],
        averageRating: 4.6,
        ratingsCount: 210000,
        imageLinks: {
          smallThumbnail:
            'https://covers.openlibrary.org/b/isbn/9780451524935-S.jpg',
          thumbnail:
            'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg',
        },
        language: 'en',
        infoLink: 'https://books.google.com/books?id=pPqQrR123789',
        canonicalVolumeLink:
          'https://books.google.com/books/about/1984.html?id=pPqQrR123789',
      },
      saleInfo: {
        country: 'FR',
        saleability: 'FREE',
        isEbook: true,
        listPrice: { amount: 0, currencyCode: 'EUR' },
        retailPrice: { amount: 0, currencyCode: 'EUR' },
      },
      accessInfo: {
        country: 'FR',
        viewability: 'ALL_PAGES',
        embeddable: true,
        publicDomain: true,
        epub: { isAvailable: true },
        pdf: { isAvailable: true },
        accessViewStatus: 'FULL_PUBLIC_DOMAIN',
      },
    },
    {
      kind: 'books#volume',
      id: 'sSuUtT456012',
      etag: 'oP6qR7sT8uV',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/sSuUtT456012',
      volumeInfo: {
        title: 'The Pragmatic Programmer',
        subtitle: 'Your Journey to Mastery',
        authors: ['David Thomas', 'Andrew Hunt'],
        publisher: 'Addison-Wesley Professional',
        publishedDate: '2019-09-13',
        description:
          "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again over the years. Whether you're new to the field or an experienced practitioner, you'll come away with fresh insights each and every time.",
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0135957052' },
          { type: 'ISBN_13', identifier: '9780135957059' },
        ],
        pageCount: 352,
        printType: 'BOOK',
        mainCategory: 'Computers / Programming',
        categories: ['Programming', 'Software Engineering', 'Best Practices'],
        averageRating: 4.6,
        ratingsCount: 8700,
        imageLinks: {
          smallThumbnail:
            'https://covers.openlibrary.org/b/isbn/9780135957059-S.jpg',
          thumbnail:
            'https://covers.openlibrary.org/b/isbn/9780135957059-M.jpg',
        },
        language: 'en',
        infoLink: 'https://books.google.com/books?id=sSuUtT456012',
        canonicalVolumeLink:
          'https://books.google.com/books/about/The_Pragmatic_Programmer.html?id=sSuUtT456012',
      },
      saleInfo: {
        country: 'FR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: { amount: 39.99, currencyCode: 'EUR' },
        retailPrice: { amount: 34.99, currencyCode: 'EUR' },
        buyLink: 'https://books.google.com/books?id=sSuUtT456012&buy=',
      },
      accessInfo: {
        country: 'FR',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        epub: { isAvailable: false },
        pdf: { isAvailable: true },
        accessViewStatus: 'SAMPLE',
      },
    },
    {
      kind: 'books#volume',
      id: 'vVwWxX789345',
      etag: 'wX9yZ0aB1cD',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/vVwWxX789345',
      volumeInfo: {
        title: 'Thinking, Fast and Slow',
        authors: ['Daniel Kahneman'],
        publisher: 'Farrar, Straus and Giroux',
        publishedDate: '2011-10-25',
        description:
          'In the international bestseller, Thinking, Fast and Slow, Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0374533555' },
          { type: 'ISBN_13', identifier: '9780374533557' },
        ],
        pageCount: 499,
        printType: 'BOOK',
        mainCategory: 'Psychology / Cognitive',
        categories: ['Psychology', 'Behavioral Economics', 'Decision Making'],
        averageRating: 4.4,
        ratingsCount: 63000,
        imageLinks: {
          smallThumbnail:
            'https://covers.openlibrary.org/b/isbn/9780374533557-S.jpg',
          thumbnail:
            'https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg',
        },
        language: 'en',
        infoLink: 'https://books.google.com/books?id=vVwWxX789345',
        canonicalVolumeLink:
          'https://books.google.com/books/about/Thinking_Fast_and_Slow.html?id=vVwWxX789345',
      },
      saleInfo: {
        country: 'FR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: { amount: 16.99, currencyCode: 'EUR' },
        retailPrice: { amount: 13.99, currencyCode: 'EUR' },
        buyLink: 'https://books.google.com/books?id=vVwWxX789345&buy=',
      },
      accessInfo: {
        country: 'FR',
        viewability: 'PARTIAL',
        embeddable: false,
        publicDomain: false,
        epub: { isAvailable: true },
        pdf: { isAvailable: false },
        accessViewStatus: 'SAMPLE',
      },
    },
  ],
}

export const bookList = {
  favorites: mockVolumesResponse,
  borrowed: mockVolumesResponse,
  to_read: mockVolumesResponse,
  reading_now: mockVolumesResponse,
  have_read: mockVolumesResponse,
  reviewed: mockVolumesResponse,
  recently_viewed: mockVolumesResponse,
  wishlist: mockVolumesResponse,
}
