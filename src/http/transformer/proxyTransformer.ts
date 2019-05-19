export default (url: string): string => {
  return url.replace('https://', process.env.PROXY_URL || 'https://')
}
