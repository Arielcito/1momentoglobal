'use client'

import Link from 'next/link'

interface DashboardProps {
  activeMenu: string;
}

export function DashboardComponent({ activeMenu }: DashboardProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">
        {activeMenu === 'live' ? 'Transmisiones en vivo' : 'Mis clases'}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Link href={`/stream/${item}`} key={item}>
            <div className="bg-card text-card-foreground rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted rounded-md mb-2" />
              <h3 className="font-medium">
                {activeMenu === 'live' ? `Transmisión en vivo ${item}` : `Clase ${item}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeMenu === 'live' ? 'En curso' : 'Disponible'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
