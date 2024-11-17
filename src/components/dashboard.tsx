'use client'

import * as React from 'react'
import { StreamComponent } from './StreamComponent'

export function DashboardComponent() {
  const [activeMenu, setActiveMenu] = React.useState('live')

  return (
    <>
      <div className="w-full h-2/3">
        <StreamComponent />
      </div>
    </>
  )
}
