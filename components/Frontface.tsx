'use client'

import click from '@/public/click.png'
import bg from '@/public/paper.webp'
import { Box, Heading, keyframes, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import { Card } from '../components/Card'
import { getGuestTypes } from '../lib/guesttype'
import { type Guest } from '../types'

interface CoverProps { guest: Guest }
type Props = CoverProps & { isFlipped: boolean, onClick: () => void }

const SingleCover = ({ guest: { name } }: CoverProps) => {
  return (
    <VStack w="100%"
      pb={'10vh'}>
      <Heading lineHeight={1}
        fontSize={'8vh'}
        mixBlendMode="color">
        {name[0]}
      </Heading>
    </VStack>
  )
}
const CoupleCover = ({ guest: { name } }: CoverProps) => {
  return (
    <VStack w="100%"
      pb={'10vh'}>
      <Heading lineHeight={1}
        fontSize={'6vh'}>
        {name[0]}
      </Heading>
      <Heading lineHeight={1}
        fontSize={'4vh'}
        color="orange.500">
        +
      </Heading>
      <Heading lineHeight={1}
        fontSize={'6vh'}>
        {name[1]}
      </Heading>
    </VStack>
  )
}
const FamilyCover = ({ guest: { name } }: CoverProps) => {
  const fullName = `${name[0]} y ${name[1]}`

  return (
    <VStack w="100%"
      pb={'10vh'}>
      <Heading lineHeight={1}
        fontSize={'3vh'}
        color="pink.300">
        Familia de
      </Heading>
      <Heading lineHeight={1}
        fontSize={'6vh'}>
        {fullName}
      </Heading>
    </VStack>
  )
}

export const Frontface = ({ guest, isFlipped, onClick }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { isSingle, isFamily, isCouple } = getGuestTypes(guest as any)

  const clickAnim = keyframes`
    from { transform: scale(1); }
    to { transform: scale(1.2); }
  `

  const fadeAnim = keyframes`
    from { opacity: 0; }
    80% { opacity: 0; }
    100% { opacity: 1; }
  `

  return (
    <Card
      bg={bg}
      onClick={onClick}
      rotation={isFlipped ? 180 : 360}
      width="80%"
    >
      {isSingle && <SingleCover guest={guest} />}
      {isFamily && <FamilyCover guest={guest} />}
      {isCouple && <CoupleCover guest={guest} />}

      <Box
        position="absolute"
        top="60vh"
        animation={`${clickAnim} 0.3s alternate infinite`}
      >
        <Box animation={`${fadeAnim} 5s linear 1`}>
          <Image src={click}
            className='w-10'
            alt="Haz click en la carta para voltearla" />
        </Box>
      </Box>
    </Card>
  )
}
