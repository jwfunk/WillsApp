import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerYoutubeLinks = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<YoutubeLinks, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly lat?: string | null;
  readonly lon?: string | null;
  readonly url: string;
  readonly user: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyYoutubeLinks = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<YoutubeLinks, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly lat?: string | null;
  readonly lon?: string | null;
  readonly url: string;
  readonly user: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type YoutubeLinks = LazyLoading extends LazyLoadingDisabled ? EagerYoutubeLinks : LazyYoutubeLinks

export declare const YoutubeLinks: (new (init: ModelInit<YoutubeLinks>) => YoutubeLinks) & {
  copyOf(source: YoutubeLinks, mutator: (draft: MutableModel<YoutubeLinks>) => MutableModel<YoutubeLinks> | void): YoutubeLinks;
}