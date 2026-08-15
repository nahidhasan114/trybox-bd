export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          created_at: string
          customer_id: string
          district: string
          division: string
          full_address: string
          id: string
          is_default: boolean
          upazila: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          district: string
          division: string
          full_address: string
          id?: string
          is_default?: boolean
          upazila: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          district?: string
          division?: string
          full_address?: string
          id?: string
          is_default?: boolean
          upazila?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          cta_text: string | null
          cta_url: string | null
          desktop_image_url: string
          display_order: number
          ends_at: string | null
          id: string
          is_active: boolean
          mobile_image_url: string | null
          starts_at: string | null
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          desktop_image_url: string
          display_order?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          mobile_image_url?: string | null
          starts_at?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          desktop_image_url?: string
          display_order?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          mobile_image_url?: string | null
          starts_at?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          session_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description_bn: string | null
          description_en: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          name_bn: string
          name_en: string
          parent_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_bn: string
          name_en: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_bn?: string
          name_en?: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          customer_phone: string
          id: string
          order_id: string | null
          used_at: string
        }
        Insert: {
          coupon_id: string
          customer_phone: string
          id?: string
          order_id?: string | null
          used_at?: string
        }
        Update: {
          coupon_id?: string
          customer_phone?: string
          id?: string
          order_id?: string | null
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          applicable_category_id: string | null
          applicable_product_id: string | null
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_discount_amount: number | null
          max_usage: number | null
          max_usage_per_customer: number
          min_order_amount: number
          starts_at: string | null
        }
        Insert: {
          applicable_category_id?: string | null
          applicable_product_id?: string | null
          code: string
          created_at?: string
          discount_type: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_discount_amount?: number | null
          max_usage?: number | null
          max_usage_per_customer?: number
          min_order_amount?: number
          starts_at?: string | null
        }
        Update: {
          applicable_category_id?: string | null
          applicable_product_id?: string | null
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_discount_amount?: number | null
          max_usage?: number | null
          max_usage_per_customer?: number
          min_order_amount?: number
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_applicable_category_id_fkey"
            columns: ["applicable_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_applicable_product_id_fkey"
            columns: ["applicable_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          alt_phone: string | null
          auth_user_id: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          alt_phone?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone: string
          updated_at?: string
        }
        Update: {
          alt_phone?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          change_qty: number
          created_at: string
          created_by: string | null
          id: string
          product_id: string | null
          reason: string
          reference_id: string | null
          variant_id: string | null
        }
        Insert: {
          change_qty: number
          created_at?: string
          created_by?: string | null
          id?: string
          product_id?: string | null
          reason: string
          reference_id?: string | null
          variant_id?: string | null
        }
        Update: {
          change_qty?: number
          created_at?: string
          created_by?: string | null
          id?: string
          product_id?: string | null
          reason?: string
          reference_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          reference_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          reference_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          reference_id?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          customization_note: string | null
          discount_amount: number
          id: string
          line_total: number
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          sku: string | null
          unit_price: number
          variant_id: string | null
          variant_name: string | null
        }
        Insert: {
          created_at?: string
          customization_note?: string | null
          discount_amount?: number
          id?: string
          line_total: number
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          sku?: string | null
          unit_price: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Update: {
          created_at?: string
          customization_note?: string | null
          discount_amount?: number
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
          unit_price?: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          coupon_id: string | null
          created_at: string
          customer_alt_phone: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string
          discount_amount: number
          district: string
          division: string
          full_address: string
          id: string
          order_note: string | null
          order_number: string
          payment_method: string
          payment_status: string
          shipping_charge: number
          status: string
          subtotal: number
          total_amount: number
          upazila: string
          updated_at: string
        }
        Insert: {
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          customer_alt_phone?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          discount_amount?: number
          district: string
          division: string
          full_address: string
          id?: string
          order_note?: string | null
          order_number?: string
          payment_method: string
          payment_status?: string
          shipping_charge?: number
          status?: string
          subtotal?: number
          total_amount?: number
          upazila: string
          updated_at?: string
        }
        Update: {
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          customer_alt_phone?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          discount_amount?: number
          district?: string
          division?: string
          full_address?: string
          id?: string
          order_note?: string | null
          order_number?: string
          payment_method?: string
          payment_status?: string
          shipping_charge?: number
          status?: string
          subtotal?: number
          total_amount?: number
          upazila?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          order_id: string
          sender_number: string | null
          status: string
          transaction_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method: string
          order_id: string
          sender_number?: string | null
          status?: string
          transaction_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          order_id?: string
          sender_number?: string | null
          status?: string
          transaction_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_badge_links: {
        Row: {
          badge_id: string
          product_id: string
        }
        Insert: {
          badge_id: string
          product_id: string
        }
        Update: {
          badge_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_badge_links_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "product_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_badge_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_badges: {
        Row: {
          color_hex: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          name_bn: string
          name_en: string
        }
        Insert: {
          color_hex?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_bn: string
          name_en: string
        }
        Update: {
          color_hex?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_bn?: string
          name_en?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_main: boolean
          product_id: string
          variant_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_main?: boolean
          product_id: string
          variant_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_main?: boolean
          product_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_default: boolean
          product_id: string
          regular_price: number | null
          sale_price: number | null
          sku: string | null
          stock_quantity: number
          updated_at: string
          variant_name: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_default?: boolean
          product_id: string
          regular_price?: number | null
          sale_price?: number | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
          variant_name: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_default?: boolean
          product_id?: string
          regular_price?: number | null
          sale_price?: number | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_videos: {
        Row: {
          created_at: string
          display_order: number
          id: string
          product_id: string
          video_type: string
          video_url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          product_id: string
          video_type?: string
          video_url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          product_id?: string
          video_type?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_videos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand_id: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string
          currency: string
          delivery_type: string
          description_bn: string | null
          description_en: string | null
          has_variants: boolean
          id: string
          is_best_seller: boolean
          is_customizable: boolean
          is_featured: boolean
          is_free_delivery: boolean
          is_new_arrival: boolean
          low_stock_threshold: number
          manage_stock: boolean
          name_bn: string
          name_en: string | null
          product_type: string
          customization_instructions: string | null
          customization_options: Json
          customization_pick_count: number
          regular_price: number
          sale_ends_at: string | null
          sale_price: number | null
          sale_starts_at: string | null
          seo_description: string | null
          seo_title: string | null
          short_description_bn: string | null
          short_description_en: string | null
          sku: string | null
          slug: string
          sold_count: number
          status: string
          stock_quantity: number
          updated_at: string
          view_count: number
          weight_grams: number
        }
        Insert: {
          barcode?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          currency?: string
          delivery_type?: string
          description_bn?: string | null
          description_en?: string | null
          has_variants?: boolean
          id?: string
          is_best_seller?: boolean
          is_customizable?: boolean
          is_featured?: boolean
          is_free_delivery?: boolean
          is_new_arrival?: boolean
          low_stock_threshold?: number
          manage_stock?: boolean
          name_bn: string
          name_en?: string | null
          product_type?: string
          customization_instructions?: string | null
          customization_options?: Json
          customization_pick_count?: number
          regular_price?: number
          sale_ends_at?: string | null
          sale_price?: number | null
          sale_starts_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description_bn?: string | null
          short_description_en?: string | null
          sku?: string | null
          slug: string
          sold_count?: number
          status?: string
          stock_quantity?: number
          updated_at?: string
          view_count?: number
          weight_grams?: number
        }
        Update: {
          barcode?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          currency?: string
          delivery_type?: string
          description_bn?: string | null
          description_en?: string | null
          has_variants?: boolean
          id?: string
          is_best_seller?: boolean
          is_customizable?: boolean
          is_featured?: boolean
          is_free_delivery?: boolean
          is_new_arrival?: boolean
          low_stock_threshold?: number
          manage_stock?: boolean
          name_bn?: string
          name_en?: string | null
          product_type?: string
          customization_instructions?: string | null
          customization_options?: Json
          customization_pick_count?: number
          regular_price?: number
          sale_ends_at?: string | null
          sale_price?: number | null
          sale_starts_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description_bn?: string | null
          short_description_en?: string | null
          sku?: string | null
          slug?: string
          sold_count?: number
          status?: string
          stock_quantity?: number
          updated_at?: string
          view_count?: number
          weight_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string | null
          customer_name: string
          id: string
          is_approved: boolean
          is_verified_purchase: boolean
          product_id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name: string
          id?: string
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_id: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          id?: string
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_rules: {
        Row: {
          charge: number
          created_at: string
          display_order: number
          free_delivery_min_order: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          zone_type: string
        }
        Insert: {
          charge?: number
          created_at?: string
          display_order?: number
          free_delivery_min_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          zone_type: string
        }
        Update: {
          charge?: number
          created_at?: string
          display_order?: number
          free_delivery_min_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          zone_type?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          permissions: Json
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: Json
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: Json
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          wishlist_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          wishlist_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          customer_id: string
          id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_invites: {
        Row: {
          email: string
          role: string
          invited_by: string | null
          created_at: string
        }
        Insert: {
          email: string
          role: string
          invited_by?: string | null
          created_at?: string
        }
        Update: {
          email?: string
          role?: string
          invited_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_owner: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      list_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: { user_id: string; email: string; role: string; created_at: string }[]
      }
      track_order: {
        Args: { p_order_number: string; p_phone: string }
        Returns: Json
      }
      create_order: {
        Args: {
          p_customer_name: string
          p_customer_phone: string
          p_customer_alt_phone: string
          p_customer_email: string
          p_division: string
          p_district: string
          p_upazila: string
          p_full_address: string
          p_order_note: string
          p_payment_method: string
          p_sender_number: string
          p_transaction_id: string
          p_items: Json
          p_coupon_code?: string | null
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
