import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsApplicationShowcase extends Struct.ComponentSchema {
  collectionName: 'components_sections_application_showcases';
  info: {
    displayName: 'Application Showcase';
    icon: 'sitemap';
  };
  attributes: {
    applications: Schema.Attribute.Relation<
      'oneToMany',
      'api::application.application'
    >;
    maxItems: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<4>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_forms';
  info: {
    displayName: 'Contact Form';
    icon: 'envelope';
  };
  attributes: {
    action: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Contact Us'>;
  };
}

export interface SectionsFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_sections';
  info: {
    displayName: 'FAQ Section';
    icon: 'question';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.faq-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_sections';
  info: {
    displayName: 'Hero Section';
    icon: 'bold';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    ctaLabel: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsNewsList extends Struct.ComponentSchema {
  collectionName: 'components_sections_news_lists';
  info: {
    displayName: 'News List';
    icon: 'newspaper';
  };
  attributes: {
    categoryFilter: Schema.Attribute.String;
    maxItems: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsProductGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_product_grids';
  info: {
    displayName: 'Product Grid';
    icon: 'th-large';
  };
  attributes: {
    category: Schema.Attribute.Relation<
      'oneToOne',
      'api::product-category.product-category'
    >;
    maxItems: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<6>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsSpacer extends Struct.ComponentSchema {
  collectionName: 'components_sections_spacers';
  info: {
    displayName: 'Spacer';
    icon: 'arrows-v';
  };
  attributes: {
    height: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.DefaultTo<'medium'>;
  };
}

export interface SectionsStatsSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_stats_sections';
  info: {
    displayName: 'Stats Section';
    icon: 'chart-bar';
  };
  attributes: {
    stats: Schema.Attribute.Component<'shared.stat-item', true>;
  };
}

export interface SectionsTextImage extends Struct.ComponentSchema {
  collectionName: 'components_sections_text_images';
  info: {
    displayName: 'Text Image';
    icon: 'columns';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_infos';
  info: {
    description: 'Address, phone, email';
    displayName: 'Contact Info';
    icon: 'phone';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    phone: Schema.Attribute.String;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: 'Frequently asked question and answer';
    displayName: 'FAQ Item';
    icon: 'question-circle';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHeroBanner extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_banners';
  info: {
    description: 'Page hero section content';
    displayName: 'Hero Banner';
    icon: 'image';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    ctaLabel: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media link';
    displayName: 'Social Link';
    icon: 'share-alt';
  };
  attributes: {
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    qrCode: Schema.Attribute.Media<'images'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSpecItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_spec_items';
  info: {
    description: 'Product specification key-value pair';
    displayName: 'Spec Item';
    icon: 'list';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedStatItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_items';
  info: {
    displayName: 'Stat Item';
    icon: 'sort-numeric-up';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.application-showcase': SectionsApplicationShowcase;
      'sections.contact-form': SectionsContactForm;
      'sections.faq-section': SectionsFaqSection;
      'sections.hero-section': SectionsHeroSection;
      'sections.news-list': SectionsNewsList;
      'sections.product-grid': SectionsProductGrid;
      'sections.spacer': SectionsSpacer;
      'sections.stats-section': SectionsStatsSection;
      'sections.text-image': SectionsTextImage;
      'shared.contact-info': SharedContactInfo;
      'shared.faq-item': SharedFaqItem;
      'shared.hero-banner': SharedHeroBanner;
      'shared.social-link': SharedSocialLink;
      'shared.spec-item': SharedSpecItem;
      'shared.stat-item': SharedStatItem;
    }
  }
}
