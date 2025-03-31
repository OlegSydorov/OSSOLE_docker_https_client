import type Message from '../models/Message';
import { ApiServiceBase } from './ApiServiceBase';
import type Brand from '../models/Brand';
import type ArticleType from '../models/ArticleType';
import type QuantityType from '../models/QuantityType';
import type Subtype from '../models/Subtype';
import type ArticlesWithMessage from '../models/Article';
import type SortedEntities from '../models/SortedEntitiesWithoutSuppliers';
import type EntityArticleReponse from '../models/EntityArticleResponse';
import type ArticleForList from '../models/Article';
import type Article from '../models/Article';
import type AssetType from '../models/AssetType';
import type AddBrand from '../models/AddBrand';
import type AddQuantityType from '../models/AddQuantityType';
import type AddMetadata from '../models/AddMetadata';
import type { CustomMetadata } from '../models/Article';
import type ArticleTag from '../models/ArticleTag';
import type addArticleTag from '../models/AddArticleTag';

export default class InventoryService extends ApiServiceBase {
  async getArticles(): Promise<ArticlesWithMessage> {
      return await this.call('/api/inventory/get/articles');
  }

  async deleteArticle(id: number): Promise<Message> {
      return await this.call(`/api/inventory/delete/article/id=${id}`, {
          method: 'DELETE',
      });
  }

  async getBrands(): Promise<Brand[]> {
      return await this.call('/api/inventory/get/brands');
  }

  async getArticleTypes(): Promise<ArticleType[]> {
      return await this.call('/api/inventory/get/articleTypes');
  }

  async getSubtypes(id: number): Promise<Subtype[]> {
      return await this.call(`/api/inventory/get/associatedSubtypes/id=${id}`);
  }

  async getQuantityTypes(): Promise<QuantityType[]> {
      return await this.call('/api/inventory/get/quantityTypes');
  }

  async createArticle(
    title: string,
    description: string,
    version: string,
    idBrand: number,
    idArticleType: number,
    idSubtype: number,
    idQuantityType: number,
    idSupplier: number,
    idTechnician: number,
    price: number,
    ean: string,
    manufacturerArticleNumber: string,
    metadatas: Array<string>,
    articleTags: Array<number>,
  ): Promise<Message> {
      return await this.call('/api/inventory/add/article/', {
          method: 'POST',
          body: JSON.stringify({
              title: title,
              description: description,
              idBrand: idBrand,
              version: version,
              idArticleType: idArticleType,
              idSubtype: idSubtype,
              idQuantityType: idQuantityType,
              idEntitySupplier: idSupplier,
              idTechnician: idTechnician,
              price: price,
              ean: ean,
              supplierArticleNumber: manufacturerArticleNumber,
              metadatas: metadatas,
              articleTags: articleTags,
          }),
      });
  }

  async updateArticle(
    id: number,
    title: string,
    description: string,
    version: string,
    idBrand: number,
    idArticleType: number,
    idSubtype: number,
    idQuantityType: number,
    idSupplier: number,
    idTechnician: number,
    price: number,
    ean: string,
    manufacturerArticleNumber: string,
    metadatas: Array<number>,
    articleTags: Array<number>,
  ): Promise<Message> {
      return await this.call('/api/inventory/update/article/', {
          method: 'PATCH',
          body: JSON.stringify({
              id: id,
              title: title,
              version: version,
              description: description,
              idBrand: idBrand,
              idArticleType: idArticleType,
              idSubtype: idSubtype,
              idQuantityType: idQuantityType,
              idEntitySupplier: idSupplier,
              idTechnician: idTechnician,
              price: price,
              ean: ean,
              supplierArticleNumber: manufacturerArticleNumber,
              metadatas: metadatas,
              articleTags: articleTags,
          }),
      });
  }

  async getEntities(): Promise<SortedEntities> {
      return await this.call('/api/inventory/get/entities');
  }

  async getArticlesFromEntity(id: Number): Promise<EntityArticleReponse> {
      return await this.call(`/api/inventory/get/articlesFromEntity/${id}`);
  }

  async getArticlesByTypeAndSubtype(
    idArticleType: Number,
    idSubtype: Number,
  ): Promise<ArticleForList> {
      return await this.call(
          `/api/inventory/get/articlesByTypeAndSubtype/idType=${idArticleType}/idSubtype=${idSubtype}`,
      );
  }

  async getArticleByID(
    id: Number,
    idEntityArticle: Number = 0,
  ): Promise<Article> {
      return await this.call(
          `/api/inventory/get/articleByID/idArticle=${id}/idEntityArticle=${idEntityArticle}`,
      );
  }

  async getSuppliers(): Promise<SortedEntities> {
      return await this.call('/api/inventory/get/suppliers');
  }

  async getSubscriptionTypes(): Promise<any> {
      return await this.call('/api/inventory/get/subscriptionTypes');
  }

  async createEntityArticle(
    soldDate: Date,
    warrantyExpiryDate: Date,
    idArticle: number,
    unitPrice: number,
    quantity: number,
    description: string,
    idEntityCustomer: number,
    idEntitySupplier: number,
    idUserCreatedBy: number,
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    idSubscriptionType: number,
    cancellationDeadline: Date,
    autoRenew: boolean,
    selectedArticleType: number,
    metadatas: Array<CustomMetadata>,
  ): Promise<Message> {
      return await this.call('/api/inventory/add/entityArticle/', {
          method: 'POST',
          body: JSON.stringify({
              soldDate: soldDate,
              warrantyExpiryDate: warrantyExpiryDate,
              idArticle: idArticle,
              price: unitPrice,
              quantity: quantity,
              description: description,
              idEntityCustomer: idEntityCustomer,
              idEntitySupplier: idEntitySupplier,
              idUserCreatedBy: idUserCreatedBy,
              subscriptionStartDate: subscriptionStartDate,
              subscriptionEndDate: subscriptionEndDate,
              idSubscriptionType: idSubscriptionType,
              cancellationDeadline: cancellationDeadline,
              autoRenew: autoRenew,
              selectedArticleType: selectedArticleType,
              metadatas: metadatas,
          }),
      });
  }

  async updateEntityArticle(
    idEntityArticle: number,
    soldDate: Date,
    warrantyExpiryDate: Date,
    idArticle: number,
    unitPrice: number,
    quantity: number,
    description: string,
    idEntitySupplier: number,
    idUserModifiedBy: number,
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    idSubscriptionType: number,
    cancellationDeadline: Date,
    selectedArticleType: number,
    autoRenew: boolean,
    idArticleSubscription: number,
    metadatas: Array<CustomMetadata>,
  ): Promise<Message> {
      return await this.call('/api/inventory/update/entityArticle/', {
          method: 'PATCH',
          body: JSON.stringify({
              idEntityArticle: idEntityArticle,
              soldDate: soldDate,
              warrantyExpiryDate: warrantyExpiryDate,
              idArticle: idArticle,
              unitPrice: unitPrice,
              quantity: quantity,
              description: description,
              idEntitySupplier: idEntitySupplier,
              idUserModifiedBy: idUserModifiedBy,
              subscriptionStartDate: subscriptionStartDate,
              subscriptionEndDate: subscriptionEndDate,
              idSubscriptionType: idSubscriptionType,
              cancellationDeadline: cancellationDeadline,
              selectedArticleType: selectedArticleType,
              autoRenew: autoRenew,
              idArticleSubscription: idArticleSubscription,
              metadatas: metadatas,
          }),
      });
  }

  async deleteEntityArticle(id: number): Promise<Message> {
      return await this.call(`/api/inventory/delete/entityArticle/id=${id}`, {
          method: 'DELETE',
      });
  }

  async deleteLicenceAndSerial(id: number): Promise<Message> {
      return await this.call(`/api/inventory/delete/licenseAndSerial/id=${id}`, {
          method: 'DELETE',
      });
  }

  async getAssetTypes(): Promise<AssetType> {
      return await this.call('/api/inventory/licenseAndSerial/get/assetTypes');
  }

  async createLicenseAndSerial(
    assetCode: string,
    idEntityArticle: number,
    idAssetType: number,
  ): Promise<Message> {
      return await this.call('/api/inventory/add/licenseAndSerial/', {
          method: 'POST',
          body: JSON.stringify({
              assetCode: assetCode,
              idEntityArticle: idEntityArticle,
              idAssetType: idAssetType,
          }),
      });
  }

  async createBrand(brandName: string): Promise<AddBrand> {
      return this.call('/api/inventory/add/brand', {
          method: 'POST',
          body: JSON.stringify({
              brandName: brandName,
          }),
      });
  }

  async createQuantityType(quantityTypeName: string): Promise<AddQuantityType> {
      return this.call('/api/inventory/add/quantityType', {
          method: 'POST',
          body: JSON.stringify({
              quantityTypeName: quantityTypeName,
          }),
      });
  }

  async getMetadata(idSubtype: number): Promise<any> {
      return this.call(`/api/inventory/get/metadata/${idSubtype}`);
  }

  async getArticleTags(idSubtype: number): Promise<ArticleTag[]> {
      return this.call(`/api/inventory/get/articleTags/${idSubtype}`);
  }

  async createMetadata(
    metadataName: string,
    idSubtype: number,
  ): Promise<AddMetadata> {
      return this.call('/api/inventory/add/metadata/', {
          method: 'POST',
          body: JSON.stringify({
              metadataName: metadataName,
              idSubtype: idSubtype,
          }),
      });
  }

  async createArticleTag(
    articleTagName: string,
    idSubtype: number,
  ): Promise<addArticleTag> {
      return this.call('/api/inventory/add/articleTag', {
          method: 'POST',
          body: JSON.stringify({
              articleTagName: articleTagName,
              idSubtype: idSubtype,
          }),
      });
  }
}
