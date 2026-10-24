const imageAssets = import.meta.glob('../../assets/arcanist/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>

export function getImageUrl(imagePath?: string): string | undefined {
  if (!imagePath) {
    return undefined
  }

  const filename = imagePath.split(/[\\/]/).pop()

  if (!filename) {
    return undefined
  }

  const match = Object.entries(imageAssets).find(([path]) => path.endsWith('/' + filename))

  return match?.[1]
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
