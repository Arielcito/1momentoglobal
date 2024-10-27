'use client'

import * as React from 'react'
import { StreamProtocolDialog } from './StreamProtocolDialog'

export function DashboardComponent() {
  const [activeMenu, setActiveMenu] = React.useState('live')

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">
        {activeMenu === 'live' ? 'Transmisiones en vivo' : 'Mis clases'}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <StreamProtocolDialog key={item} streamId={item} />
        ))}
      </div>
    </>
  )
}
