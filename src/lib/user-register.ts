
import CrudOperations from '@/lib/crud-operations';
import { generateAdminUserToken } from '@/lib/auth';

export async function userRegisterCallback(user: {
  id: string;
  email: string;
  role: string;
}): Promise<void> {
  try {
    const adminToken = await generateAdminUserToken();
    const usuariosCrud = new CrudOperations("usuarios", adminToken);

    const usuarioData = {
      user_id: parseInt(user.id),
      nombre: user.email.split('@')[0],
      apellido: '',
      dni: '00000000',
      rol: 'mesero',
      activo: true,
    };

    await usuariosCrud.create(usuarioData);
    console.log(`Perfil de usuario creado para user_id ${user.id}`);
  } catch (error) {
    console.error('Error al crear perfil de usuario:', error);
  }
}
