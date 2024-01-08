import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Spacer,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { BsDash, BsFillPersonPlusFill, BsPlus } from 'react-icons/bs'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useFormik } from 'formik'
import { ChangeEvent } from 'react'
import removeAccents from 'remove-accents'
import { toAmount, toNames, toSlug } from '../lib/string'
import { useHostId } from '../lib/useHost'

type Props = {
  onSuccess: () => void
}

export const AddGuest: React.FC<Props> = ({ onSuccess }) => {
  const { isLoadingHostId, hostId } = useHostId()

  const toast = useToast({
    position: 'bottom-right',
  })
  const client = useSupabaseClient()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const formik = useFormik({
    initialValues: {
      rawNames: '',
      isFamily: false,
      maxAmount: 1,
      slug: '',
    },
    onSubmit: async (values) => {
      try {
        const { error } = await client.from('guests').insert({
          isFamily: values.isFamily,
          slug: values.slug,
          name: toNames(values.rawNames),
          maxAmount: values.maxAmount,
          host: hostId,
          event: process.env.NEXT_PUBLIC_EVENT_ID,
        })

        if (error) {
          if (error.code === '23505') {
            formik.setFieldError('slug', 'Este enlace ya existe')
            throw new Error('El enlace ya existe, utiliza uno distinto: ')
          }

          throw new Error('Error creando la invitación: ')
        }

        toast({
          title: 'Invitado registrado!',
          status: 'success',
        })

        onClose()
        formik.resetForm()
        onSuccess()
      } catch (e: any) {
        toast({
          title: e.message,
          status: 'error',
        })
      }
    },
  })

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const amount = toAmount(value)

    formik.setFieldValue('maxAmount', amount)
    formik.setFieldValue('slug', toSlug(value))
    formik.setFieldValue('rawNames', value)
  }

  const handleChangeSlug = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    formik.setFieldValue('slug', removeAccents(value))
  }

  const { maxAmount, isFamily, rawNames } = formik.values

  return (
    <>
      <Tooltip label="añadir">
        <IconButton
          variant="admin"
          size="sm"
          aria-label="añadir"
          colorScheme="blue"
          onClick={onOpen}
          icon={<BsFillPersonPlusFill />}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="gray.700" color="gray.100" mx={4}>
          <ModalHeader>Añadir invitado</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" gap={3}>
            <FormControl>
              <FormLabel>Nombre/s</FormLabel>
              <Input
                required
                name="rawNames"
                onChange={handleChangeName}
                value={formik.values.rawNames}
              />
              <FormHelperText>Separados por comas</FormHelperText>
            </FormControl>

            <FormControl isInvalid={!!formik.errors.slug}>
              <FormLabel>Enlace</FormLabel>
              <Input
                required
                name="slug"
                onChange={handleChangeSlug}
                value={formik.values.slug}
              />
              <FormHelperText>Enlace personalizado y unico</FormHelperText>
              <FormErrorMessage>{formik.errors.slug}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <Checkbox
                name="isFamily"
                onChange={formik.handleChange}
                isChecked={formik.values.isFamily}
              >
                Es una familia
              </Checkbox>
              <FormHelperText>
                Marcar si van mas miembros a parte de los nombrados
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Invitados</FormLabel>
              <HStack>
                <IconButton
                  disabled={!isFamily || maxAmount <= toAmount(rawNames)}
                  onClick={() => {
                    formik.setFieldValue('maxAmount', +maxAmount - 1)
                  }}
                  colorScheme="blue"
                  size="xs"
                  aria-label="menos"
                  icon={<BsDash />}
                />
                <Input
                  disabled={!isFamily}
                  required
                  min={1}
                  type="number"
                  name="maxAmount"
                  onChange={formik.handleChange}
                  value={formik.values.maxAmount}
                />
                <IconButton
                  disabled={!isFamily}
                  onClick={() => {
                    formik.setFieldValue('maxAmount', +maxAmount + 1)
                  }}
                  colorScheme="blue"
                  size="xs"
                  aria-label="menos"
                  icon={<BsPlus />}
                />
              </HStack>
              <FormHelperText>
                Cuantas personas incluye, máximo, esta invitacion
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => formik.resetForm()}
              isLoading={formik.isSubmitting || isLoadingHostId}
            >
              Limpiar
            </Button>
            <Spacer />
            <Button
              colorScheme="blue"
              onClick={() => formik.handleSubmit()}
              isLoading={formik.isSubmitting || isLoadingHostId}
            >
              Añadir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
