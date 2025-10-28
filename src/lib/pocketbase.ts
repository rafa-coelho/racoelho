// PocketBase REST helper (usando SDK oficial)

import { getPocketBaseClient } from './auth';
import PocketBase from 'pocketbase';

type ListParams = {
  page?: number;
  perPage?: number;
  filter?: string;
  sort?: string;
  fields?: string;
};

export async function pbList(collection: string, params?: ListParams) {
  const pb = getPocketBaseClient();
  return await pb.collection(collection).getList(
    params?.page || 1,
    params?.perPage || 20,
    {
      filter: params?.filter,
      sort: params?.sort,
      fields: params?.fields,
    }
  );
}

export async function pbGetById(collection: string, id: string) {
  const pb = getPocketBaseClient();
  return await pb.collection(collection).getOne(id);
}

export async function pbFirstByFilter(collection: string, filter: string, fields?: string) {
  const pb = getPocketBaseClient();
  return await pb.collection(collection).getFirstListItem(filter, {
    fields: fields,
  });
}

export async function pbCreate(collection: string, data: any) {
  const pb = getPocketBaseClient();
  return await pb.collection(collection).create(data);
}

export async function pbUpdate(collection: string, id: string, data: any) {
  const pb = getPocketBaseClient();
  return await pb.collection(collection).update(id, data);
}

export async function pbDelete(collection: string, id: string) {
  const pb = getPocketBaseClient();
  return await pb.collection(collection).delete(id);
}


