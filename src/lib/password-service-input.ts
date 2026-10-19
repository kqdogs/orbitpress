import { z } from 'zod';
export const passwordChangeInput = z.object({
  currentPassword: z.string().min(1, '请输入当前密码').max(200, '当前密码不能超过200个字符'),
  newPassword: z.string().min(12, '新密码至少需要12个字符').max(200, '新密码不能超过200个字符'),
  confirmPassword: z.string().min(12, '请再次输入新密码（至少12个字符）').max(200, '确认密码不能超过200个字符'),
}).strict().superRefine((value, ctx) => {
  if (value.newPassword !== value.confirmPassword) ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: '两次输入的新密码不一致' });
  if (value.newPassword === value.currentPassword) ctx.addIssue({ code: 'custom', path: ['newPassword'], message: '新密码不能与原密码相同' });
});
