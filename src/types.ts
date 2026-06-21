export type Category = 'anime' | 'manga' | 'games'
export type Status = 'completed' | 'in-progress' | 'dropped' | 'planned'

export interface ArchiveItem {
  id: string
  title: string
  category: Category
  year: number
  status: Status
  rating?: number
  score?: number
  note: string
  imageUrl: string
  hours?: number
  chapters?: number
}
