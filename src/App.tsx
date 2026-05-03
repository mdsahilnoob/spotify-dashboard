import { useState } from 'react'
import { ArrowRight, Heart, Music4, Search, Sparkles } from 'lucide-react'

import './index.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Track = {
  title: string
  artist: string
  album: string
  duration: string
  mood: 'Focus' | 'Energy' | 'Chill' | 'Late Night'
  liked: boolean
}

const featuredTracks: Track[] = [
  {
    title: 'Midnight Drive',
    artist: 'Neon Orbit',
    album: 'Afterglow Sessions',
    duration: '3:42',
    mood: 'Late Night',
    liked: true,
  },
  {
    title: 'Sunrise Pulse',
    artist: 'Northlane',
    album: 'Morning Signals',
    duration: '2:58',
    mood: 'Energy',
    liked: true,
  },
  {
    title: 'Soft Focus',
    artist: 'Quiet Frame',
    album: 'Deep Work',
    duration: '4:15',
    mood: 'Focus',
    liked: false,
  },
  {
    title: 'Golden Hour Loop',
    artist: 'Harbor Lights',
    album: 'City Glow',
    duration: '3:09',
    mood: 'Chill',
    liked: true,
  },
  {
    title: 'Velvet Motion',
    artist: 'Rooftop Theory',
    album: 'Pulse State',
    duration: '3:21',
    mood: 'Energy',
    liked: false,
  },
  {
    title: 'Low Light Study',
    artist: 'Paper Moon',
    album: 'Room Tone',
    duration: '5:02',
    mood: 'Focus',
    liked: true,
  },
]

const stats = [
  { label: 'Tracks in demo', value: '6' },
  { label: 'Saved tracks', value: '4' },
  { label: 'Best mood match', value: 'Focus' },
]

function App() {
  const [query, setQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState<'All' | Track['mood']>('All')
  const [activeTrack, setActiveTrack] = useState<Track>(featuredTracks[0])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredTracks = featuredTracks.filter((track) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [track.title, track.artist, track.album, track.mood]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    const matchesMood = selectedMood === 'All' || track.mood === selectedMood

    return matchesQuery && matchesMood
  })

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top,rgba(31,41,55,0.08),transparent_38%),linear-gradient(180deg,#08111d_0%,#0f172a_55%,#e5eef8_55%,#f8fbff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-white/25 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur xl:flex-row">
        <section className="flex flex-1 flex-col gap-8 bg-slate-950 px-6 py-6 text-white sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-300">
                <Sparkles className="size-3.5" />
                Demo mode
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Spotify dashboard, simplified.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Search a curated track list, filter by mood, and inspect a live preview panel without needing an API key.
              </p>
            </div>

            <Button className="hidden shrink-0 gap-2 rounded-full bg-emerald-400 px-5 text-slate-950 hover:bg-emerald-300 sm:inline-flex">
              Connect Spotify
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/6 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.25)]">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
              Search tracks
            </label>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try 'focus', 'energy', or an artist name"
                  className="h-12 border-white/10 bg-slate-900/70 pl-9 text-white placeholder:text-slate-500 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/30"
                />
              </div>
              <Button
                variant="secondary"
                className="h-12 rounded-full bg-white text-slate-950 hover:bg-slate-100"
                onClick={() => setQuery('')}
              >
                Clear search
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['All', 'Focus', 'Energy', 'Chill', 'Late Night'].map((mood) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMood(mood as typeof selectedMood)}
                  className={
                    selectedMood === mood
                      ? 'rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                      : 'rounded-full border-white/10 bg-transparent text-white hover:bg-white/10'
                  }
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Featured tracks</h2>
                <p className="text-sm text-slate-400">Click any card to pin it into the preview panel.</p>
              </div>
              <p className="text-sm text-slate-400">
                Showing <span className="font-semibold text-white">{filteredTracks.length}</span> track
                {filteredTracks.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredTracks.map((track) => {
                const isSelected = track.title === activeTrack.title

                return (
                  <button
                    key={track.title}
                    type="button"
                    onClick={() => setActiveTrack(track)}
                    className={`group rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                      isSelected
                        ? 'border-emerald-400/70 bg-emerald-400/10 shadow-[0_18px_45px_rgba(16,185,129,0.16)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                          <Music4 className="size-3.5" />
                          {track.mood}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">{track.title}</h3>
                        <p className="mt-1 text-sm text-slate-300">{track.artist}</p>
                      </div>
                      <div
                        className={`rounded-full p-2 ${
                          track.liked ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        <Heart className="size-4" fill={track.liked ? 'currentColor' : 'none'} />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                      <span>{track.album}</span>
                      <span>{track.duration}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <aside className="w-full border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-8 lg:w-[24rem] lg:border-l lg:border-t-0 lg:px-7">
          <div className="rounded-[1.75rem] bg-linear-to-br from-slate-900 via-slate-800 to-emerald-500 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Now playing</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{activeTrack.title}</h2>
            <p className="mt-1 text-sm text-slate-200">
              {activeTrack.artist} · {activeTrack.album}
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm text-slate-100">
                <span>Playback progress</span>
                <span>{activeTrack.duration}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/15">
                <div className="h-2 w-2/3 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,0.6)]" />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-200">
                Mood: <span className="font-semibold text-white">{activeTrack.mood}</span>
                {activeTrack.liked ? ' · already saved to your likes.' : ' · not saved yet.'}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Quick actions</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Keep the demo moving</h3>
            </div>

            <div className="space-y-3">
              <Button className="w-full justify-between rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
                Open Spotify
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between rounded-2xl border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100"
                onClick={() => setActiveTrack(featuredTracks[0])}
              >
                Reset preview
                <Sparkles className="size-4" />
              </Button>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              This page now behaves like a small product instead of a placeholder: it has search, filters,
              selection, and stateful playback preview built entirely on local data.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default App
