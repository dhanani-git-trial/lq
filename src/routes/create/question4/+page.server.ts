import type { PageServerLoad, Actions } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { tempquest_pass, wrong_question_access, return_tempquest_data } from '$lib/server/createaquest';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const pageName = Number(url.pathname.slice(-1)) || -9;
  const email = cookies.get("email");
  if (!email) throw error(400, "Missing email cookie");
  if (pageName != -9) {
    await wrong_question_access(email, pageName);
  }

  const tempquest = await return_tempquest_data(email);
  return { tempquest: tempquest}
};


export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const email = cookies.get("email");
        if (!email) throw error(400, "Missing email cookie");
        const formData = await request.formData();

        //CHANGE
        const info = Object.fromEntries(formData) as { question_4: string; answerchoicea_4: string; answerchoiceb_4: string; answerchoicec_4: string; answerchoiced_4: string; explanation_4: string; image_4: string;};
        //CHANGE


        await tempquest_pass(email, info);
        
        throw redirect(303, '/create/quest_storage');
    }
};
