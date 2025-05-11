import placeholderImg from '@/assets/placeholder.jpg'

export function GET(request: Request) {
  console.log(request)
  return Response.json(placeholderImg)
}