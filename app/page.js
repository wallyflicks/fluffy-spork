export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Orivox — Free AI Speaking Coach | Practice Thinking on Your Feet',
  description: 'Practice any speaking scenario and get instant AI feedback on clarity, filler words, confidence, and structure. Free, no sign-up needed. Built by a student in Vancouver.',
}

import Orivox from '../components/Orivox'

export default function Home() {
  return <Orivox />
}
