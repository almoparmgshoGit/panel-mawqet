import { api } from "@/lib/api";

class SupabaseQueryBuilder implements PromiseLike<any> {
  table: string;
  queryType: 'select' | 'insert' | 'update' | 'delete' = 'select';
  payload: any = null;
  filters: Record<string, any> = {};
  private _promise: Promise<any> | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns = '*') {
    this.queryType = 'select';
    return this;
  }

  insert(data: any) {
    this.queryType = 'insert';
    this.payload = data;
    return this;
  }

  update(data: any) {
    this.queryType = 'update';
    this.payload = data;
    return this;
  }

  delete() {
    this.queryType = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    this.filters[column] = value;
    return this;
  }

  order(column: string, opts?: { ascending?: boolean }) {
    return this;
  }

  limit(n: number) {
    return this;
  }

  in(column: string, values: any[]) {
    return this;
  }

  single() {
    return this;
  }

  then<TResult1 = any, TResult2 = never>(
    onFulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    if (!this._promise) {
      this._promise = this.execute();
    }
    return this._promise.then(onFulfilled, onRejected);
  }

  private async execute() {
    try {
      let data: any = null;
      const realTable = this.table === 'janazah_announcements' ? 'janazah' : this.table === 'reports' ? 'feedback' : this.table;

      if (this.queryType === 'select') {
        if (realTable === 'donations') data = await api.getDonations();
        else if (realTable === 'adhkar_categories') data = await api.getAdhkarCategories();
        else if (realTable === 'community_posts') data = await api.getPosts();
        else if (realTable === 'janazah') data = await api.getJanazahs();
        else if (realTable === 'knowledge_collections') data = await api.getCollections();
        else if (realTable === 'feedback') data = await api.getFeedback();
        else if (realTable === 'adhkar_items') {
          const cats = await api.getAdhkarCategories();
          data = [];
          for (const c of cats) {
            if (c.items) data.push(...c.items);
          }
        } else if (realTable === 'knowledge_items') {
          const cols = await api.getCollections();
          data = [];
          for (const col of cols) {
            if (col.items) data.push(...col.items);
          }
        } else {
          data = [];
        }

        if (this.filters['id']) {
          data = Array.isArray(data) ? data.find((x: any) => x.id === this.filters['id']) : null;
        }
      } else if (this.queryType === 'insert') {
        if (realTable === 'donations') data = await api.createDonation(this.payload);
        else if (realTable === 'adhkar_categories') data = await api.createAdhkarCategory(this.payload);
        else if (realTable === 'adhkar_items') data = await api.createAdhkarItem(this.payload);
        else if (realTable === 'community_posts') data = await api.createPost(this.payload);
        else if (realTable === 'janazah') data = await api.createJanazah(this.payload);
        else if (realTable === 'knowledge_collections') data = await api.createCollection(this.payload);
        else if (realTable === 'knowledge_items') data = await api.createCollectionItem(this.payload);
        else if (realTable === 'feedback') data = await api.createFeedback(this.payload);
      } else if (this.queryType === 'update') {
        const id = this.filters['id'];
        if (realTable === 'donations') data = await api.updateDonation(id, this.payload);
        else if (realTable === 'adhkar_categories') data = await api.updateAdhkarCategory(id, this.payload);
        else if (realTable === 'adhkar_items') data = await api.updateAdhkarItem(id, this.payload);
        else if (realTable === 'community_posts') data = await api.updatePost(id, this.payload);
        else if (realTable === 'janazah') data = await api.updateJanazah(id, this.payload);
        else if (realTable === 'knowledge_collections') data = await api.updateCollection(id, this.payload);
        else if (realTable === 'knowledge_items') data = await api.updateCollectionItem(id, this.payload);
        else if (realTable === 'feedback') data = await api.updateFeedback(id, this.payload);
      } else if (this.queryType === 'delete') {
        const id = this.filters['id'];
        if (realTable === 'donations') data = await api.deleteDonation(id);
        else if (realTable === 'adhkar_categories') data = await api.deleteAdhkarCategory(id);
        else if (realTable === 'adhkar_items') data = await api.deleteAdhkarItem(id);
        else if (realTable === 'community_posts') data = await api.deletePost(id);
        else if (realTable === 'janazah') data = await api.deleteJanazah(id);
        else if (realTable === 'knowledge_collections') data = await api.deleteCollection(id);
        else if (realTable === 'knowledge_items') data = await api.deleteCollectionItem(id);
        else if (realTable === 'feedback') data = await api.deleteFeedback(id);
      }

      return { data, error: null, count: Array.isArray(data) ? data.length : 1 };
    } catch (err: any) {
      return { data: null, error: { message: err.message || String(err) }, count: 0 };
    }
  }
}

export function createClient() {
  return {
    from: (table: string) => new SupabaseQueryBuilder(table),
    storage: {
      from: (bucket: string) => ({
        upload: async (...args: any[]) => ({ error: null as { message: string } | null }),
        uploadBinary: async (...args: any[]) => ({ error: null as { message: string } | null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
      }),
    },
    auth: {
      getUser: async () => ({ data: { user: { email: 'admin@mawaqit.local' } }, error: null }),
      getSession: async () => ({ data: { session: { access_token: 'mock-token' } }, error: null }),
      signInWithPassword: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    },
  };
}
