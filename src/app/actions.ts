'use server'
import { auth } from "@/auth";
import { z } from 'zod'
import { prisma } from "@/lib/prisma";

export async function getInitialCode() {
  const session = await auth();

  if (!session?.user.username) {
    return null;
  }

  const code = await prisma.codeSnippet.findUnique({
    where: {
      identifier: session.user.username,
    },
    include: {
      codeTabs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return code;
}

const editCodeTabSchema = z.object({
  tabId: z.string(),
  tabName: z
    .string()
    .min(1, 'O slug é obrigatório')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug inválido: use só letras minúsculas, números e hífens – tipo minha-tab-1 😉',
    ).optional(),
  content: z.string().optional(),
})
export async function editCodeTabAction(data: FormData) {
  const result = editCodeTabSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  try {
    const session = await auth()
    if (!session?.user.username) {
      return { success: false, message: 'Não autorizado', errors: null }
    }

    const existingTab = await prisma.codeTab.findFirst({
      where: {
        id: result.data.tabId,
        codeSnippet: {
          identifier: session.user.username,
        },
      },
    })

    if (!existingTab) {
      return { success: false, message: 'Tab inexistente', errors: null }
    }

    await prisma.codeTab.update({
      where: {
        id: result.data.tabId,
        codeSnippet: {
          identifier: session.user.username,
        },
      },
      data: {
        name: result.data.tabName,
        content: result.data.content
      }
    })
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'Erro ao editar, tente novamente mais tarde',
      errors: null,
    }
  }
  return {
    success: true,
    message: 'Editado com sucesso!',
    errors: null,
  }
}

const createCodeTabSchema = z.object({
  tabName: z
    .string()
    .min(1, 'O slug é obrigatório')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug inválido: use só letras minúsculas, números e hífens – tipo minha-tab-1 😉',
    )
})
export async function createCodeTabAction(data: FormData) {
  const result = createCodeTabSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  try {
    const session = await auth()
    if (!session?.user.username) {
      return { success: false, message: 'Não autorizado', errors: null }
    }

    const sumTabs = await prisma.codeTab.count({
      where: {
        codeSnippet: {
          identifier: session.user.username
        }
      },
    })

    if (sumTabs >= 6) {
      return {
        success: false,
        message: 'Limite de abas atingido',
        errors: null,
      }
    }

    const existingTabWithSameName = await prisma.codeTab.findFirst({
      where: {
        codeSnippet: {
          identifier: session.user.username
        },
        name: result.data.tabName,
      },
    })

    if (existingTabWithSameName) {
      return {
        success: false,
        message: 'Já existe uma aba com esse nome',
        errors: null,
      }
    }

    await prisma.codeTab.create({
      data: {
        name: result.data.tabName,
        content: '// Nova aba',
        codeSnippet: {
          connect: {
            identifier: session.user.username,
          }
        }
      }
    })
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'Erro ao criar, tente novamente mais tarde',
      errors: null,
    }
  }
  return {
    success: true,
    message: 'Criado com sucesso!',
    errors: null,
  }
}


const deleteCodeTabSchema = z.object({
  tabId: z.string(),
})
export async function deleteCodeTabAction(data: FormData) {
  const result = deleteCodeTabSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const tabId = result.data.tabId

  try {
    const session = await auth()
    if (!session?.user.username) {
      return { success: false, message: 'Não autorizado', errors: null }
    }

    await prisma.codeTab.delete({
      where: {
        id: tabId,
        codeSnippet: {
          identifier: session.user.username
        }
      }
    })
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'Erro ao deletar, tente novamente mais tarde',
      errors: null,
    }
  }
  return {
    success: true,
    message: 'Deletado com sucesso!',
    errors: null,
  }
}