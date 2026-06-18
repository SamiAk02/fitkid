export type Availability = 'free' | 'waitlist'

export interface Course {
    id: string
    title: string
    provider: string
    schedule: string
    pricePerMonth: number
    /** eligible for BuT (Bildung & Teilhabe) funding */
    butEligible: boolean
    availability: Availability
    spotsLeft?: number
}